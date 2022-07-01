module.exports = {
    style: {
        postcss: {
            plugins: [
                require('tailwingcss'),
                require('autofixer'),
            ],
        },
    },
}