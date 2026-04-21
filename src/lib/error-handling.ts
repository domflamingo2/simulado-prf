class SimuladoError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SimuladoError';
    }
}

function errorHandler(error) {
    if (error instanceof SimuladoError) {
        console.error(`SimuladoError: ${error.message}`);
    } else {
        console.error(`Error: ${error.message}`);
    }
}

module.exports = { SimuladoError, errorHandler };