;(function() {
    "use strict"
    window.addEventListener("load", setupWebGL, false);

    function setupWebGL(evt) {
        const startTime = new Date();
        window.removeEventListener(evt.type, setupWebGL, false);
        let canvas = document.querySelector("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, document.querySelector("#vertex-shader").innerHTML);
        gl.compileShader(vertexShader);
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, document.querySelector("#fragment-shader").innerHTML);
        gl.compileShader(fragmentShader);
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

        const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
        gl.enableVertexAttribArray(0);
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        gl.useProgram(program);
        const timeLocation = gl.getUniformLocation(program, "iTime");
        const widthLocation = gl.getUniformLocation(program, "width");
        const heightLocation = gl.getUniformLocation(program, "height");
        gl.uniform1f(widthLocation, window.innerWidth);
        gl.uniform1f(heightLocation, window.innerHeight);
        setInterval(() => {
            gl.uniform1f(timeLocation, (new Date() - startTime) / 1000.0);
            if (canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.uniform1f(widthLocation, window.innerWidth);
                gl.uniform1f(heightLocation, window.innerHeight);
            }

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }, 1000 / 60);
    }
})();