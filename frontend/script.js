console.log("script.js loaded!");

const btn = document.getElementById("connectBtn");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

btn.onclick = async () => {

    console.log("Start button clicked");
    btn.style.display = "none";

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext();
    const src = audioCtx.createMediaStreamSource(stream);
    const processor = audioCtx.createScriptProcessor(2048, 1, 1);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    src.connect(analyser);
    src.connect(processor);
    processor.connect(audioCtx.destination);

    // WebSocket connection
    const ws = new WebSocket("ws://localhost:8080/audio");
    ws.binaryType = "arraybuffer";

    ws.onopen = () => console.log("WebSocket connected!");
    ws.onerror = (e) => console.log("WebSocket error:", e);
    ws.onclose = () => console.log("WebSocket closed");
    ws.onmessage = (msg) => console.log("Server:", msg.data);

    processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const buf = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) buf[i] = input[i] * 0x7fff;
        if (ws.readyState === 1) ws.send(buf);
    };

    const data = new Uint8Array(analyser.frequencyBinCount);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(data);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const r = 150;

        for (let i = 0; i < data.length; i++) {
            const v = data[i] * 1.2;
            const a = (i / data.length) * Math.PI * 2;

            const x1 = cx + Math.cos(a) * r;
            const y1 = cy + Math.sin(a) * r;

            const x2 = cx + Math.cos(a) * (r + v);
            const y2 = cy + Math.sin(a) * (r + v);

            ctx.strokeStyle = "hsl(" + i * 2 + ", 100%, 50%)";
            ctx.lineWidth = 3;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    draw();
};
