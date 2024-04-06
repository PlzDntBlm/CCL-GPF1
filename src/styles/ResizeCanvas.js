export function startResizing() {
    // Call resizeCanvas on window resize and on initial load
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

function resizeCanvas() {
    const overlay = document.getElementById('pxBricks-overlay');
    const canvas = document.getElementById('pxBricks-canvas');

    const overlayWidth = overlay.offsetWidth;
    const overlayHeight = overlay.offsetHeight;
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;

    // Calculate scale factors
    const scaleX = overlayWidth / canvasWidth;
    const scaleY = overlayHeight / canvasHeight;

    // Choose the smaller scale factor
    const scale = Math.min(scaleX, scaleY);

    // Apply the scale transform
    canvas.style.transform = `scale(${scale})`;
    canvas.style.transformOrigin = 'center';
}
