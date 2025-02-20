module.exports = {
        default: (ctx, size) => {},

        invert: (ctx, size) => {
                ctx.globalCompositeOperation = 'difference';
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, size, size);
        },

        grey: (ctx, size) => {
                const imageData = ctx.getImageData(0, 0, size, size);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                        data[i] = avg; // Red
                        data[i + 1] = avg; // Green
                        data[i + 2] = avg; // Blue
                }

                ctx.putImageData(imageData, 0, 0);
        },

        gray: (ctx, size) => {
                module.exports.grey(ctx, size);
        }
};
