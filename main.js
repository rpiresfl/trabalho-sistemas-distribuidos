var readline = require('readline');
var fs = require('fs');
var nums = [];
var receiptLines = [];
var winningBets = 0;

var leitor = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function readWinningNumbers(prompt = '1: ') {
    leitor.question(prompt, (answer) => {
        if (answer < 1 || answer > 60) {
            readWinningNumbers(nums.length + 1 + ': ');
        } else {
            nums.push(answer);
            if (nums.length > 5) {
                leitor.close();
                checkForWinners();
            } else {
                readWinningNumbers(nums.length + 1 + ': ');
            }
        }
    });
}

function checkForWinners() {
    fs.readFile('bets.txt', 'utf-8', (err, bets) => {
        if (err) {
            console.log('Arquivo nao encontrado');
        } else {
            receiptLines.push('Numeros sorteados: ' + nums)
            receiptLines.push('Apostas:');
            let lines = bets.split(/\r?\n/);
            lines.forEach((line) => {
                let dozens = line.split(',');
                let count = 0;

                for (let i=0;i<dozens.length;i++) {
                    if (dozens[i] === nums[i]) count++;
                };
                if (count === 6) winningBets++;

                receiptLines.push(dozens + ' Acertos: ' + count);
            });
            if (winningBets > 0) receiptLines.push('GANHADOR');

            saveReceipt();
        }
    })
}

function saveReceipt() {
    let fileName = getFileName();
    let finalReceipt = '';
    receiptLines.forEach((receiptLine) => {
        finalReceipt += receiptLine + '\n';
    });

    fs.open(fileName, 'w', (err) => {
        if (err) {
            console.log('Erro ao criar o arquivo');
        } else {
            fs.writeFile(fileName, finalReceipt, (err) => {
                if (err) {
                    console.log('Erro ao salvar a jogada');
                }

                process.exit();
            })
        }
    })
    
}

function getFileName() {
    let currentDate = new Date();
    let day = ("0" + currentDate.getDate()).slice(-2);
    let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    let year = currentDate.getFullYear();
    let hours = checkMinHour(currentDate.getHours());
    let minutes = checkMinHour(currentDate.getMinutes());
    
    currentDate = year + month + day + hours + minutes;

    return currentDate + '.txt';
}

function checkMinHour(value) {
    if ((value + '').length === 1) {
        value = '0' + value;
    }
    return value;
}

console.log('Informe 6 numeros entre 1 e 60:');
readWinningNumbers();