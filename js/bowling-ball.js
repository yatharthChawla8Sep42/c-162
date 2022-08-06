AFRAME.registerComponent("throw", {
    schema:{
        modelId: {type:"string", default:"./assets/bowling_ball.glb"},
        scale: {type:"number", default:.05}
    },
    init: function(){
        this.throwBalls();
    },
    throwBalls: function(){
        window.addEventListener("keydown", pressed=>{
            if (pressed.key === "q" || pressed.key === "Q"){
                const {data} = this;
                var ball = document.createElement("a-entity");
                ball.setAttribute("gltf-model", data.modelId);
                ball.setAttribute("scale", {
                    x: data.scale, 
                    y: data.scale, 
                    z: data.scale
                });
                ball.setAttribute("visible", true);
                ball.setAttribute("dynamic-body", {mass:0, shape:"sphere"});

                var camera = document.querySelector("#camera");
                var pos = camera.getAttribute("position");
                var rot = camera.getAttribute("rotation")
                ball.setAttribute("position", {
                    x: pos.x, 
                    y: pos.y-1, 
                    z: pos.z
                });
                ball.setAttribute("rotation", {
                    x: rot.x, 
                    y: rot.y+180, 
                    z: rot.z
                });

                var camera3D = camera.object3D;
                var direction = new THREE.Vector3();
                camera3D.getWorldDirection(direction);
                ball.setAttribute("velocity", direction.multiplyScalar(-10));

                ball.addEventListener("collide", this.removeBalls);

                var scene = document.querySelector("#main-scene");
                scene.appendChild(ball);
            };
        });
    },
    removeBalls: function(e){
        var element = e.detail.target.el;
        var elementHit = e.detail.body.el;
        if (elementHit.id.includes("pin")){
            element.removeEventListener("collide", this.throwBalls);

            var impulse = new CANNON.Vec3(0, 0, 10);
            var worldPoint = new CANNON.Vec3().copy(elementHit.getAttribute("position"));
            elementHit.body.applyImpulse(impulse, worldPoint);

            var scene = document.querySelector("#main-scene");
            scene.removeChild(element);
        }
    }
});