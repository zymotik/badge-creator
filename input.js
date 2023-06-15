
const readline = require('readline');

module.exports = {
    askQuestion,
}

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(`\n${query}`, ans => {
        rl.close();
        console.log();
        resolve(ans);
    }))
}
