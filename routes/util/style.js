module.exports = {
    invert: (ctx, size) => {
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data.set([255 - data[i], 255 - data[i + 1], 255 - data[i + 2]], i);
        }

        ctx.putImageData(imageData, 0, 0);
    },

    grey: (ctx, size) => {
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data.set([avg, avg, avg], i);
        }

        ctx.putImageData(imageData, 0, 0);
    },

    gray: (ctx, size) => { module.exports.grey(ctx, size); }
};
