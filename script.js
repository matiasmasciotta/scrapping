// SCRIPT FINAL DA RESULTADOS OK O FALLO

const puppeteer = require('puppeteer-core');

// Ids a automatizar
const ids = [
    32204,
    32203,
    32199,
    32196,
    32195,
    32185,
    32180,
    32179,
    32177,
    32175,
    32160,
    32155,
    32154,
    32113,
    32107,
    32100,
    32097,
    32095,
    32084,
    32082,
    32073,
    32071,
    32061,
    32053,
    32044,
    32023,
    31986,
    31972,
    31964,
    31957,
    31922,
    31909,
    31889,
    31850,
    31826,
    31789,
    31780,
    31773,
    31766,
    31733,
    31724,
    31705,
    31700,
    31669,
    31667,
    31660,
    31657,
    31654,
    31623,
    31594
  ];
  
  
  
// url gestion cliente
const url = 'https://grupomasmovil.inconcertcc.com/mas/contact/people/view/';
// credenciales login
const user = 'Matias';
const pass = 'Matias12/';
// nombre de automatizacion
const automationName = 'LeadBruto900_C-G-TELECABLE';

// Obtener la fecha actual
const currentDate = new Date();

// Obtener el día, el mes y el año de la fecha actual
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1; // Los meses en JavaScript se indexan desde 0, por lo tanto se suma 1
const year = currentDate.getFullYear();

// Formatear la fecha con ceros a la izquierda si es necesario
const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

const dateControl = formattedDate;

console.log(dateControl);

async function automate() {
    const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    });

    const results = [];
    const firstID = ids.slice()[0];
    const firstPage = await browser.newPage();

    try {
        // Iniciar sesión en el primer ID
        await firstPage.goto(`${url}${firstID}`);
        await firstPage.type('#userId', user);
        await firstPage.type('#password', pass);
        await firstPage.click('button[type="submit"]');
        await firstPage.waitForNavigation({ waitUntil: 'networkidle0' });
        console.log(`Login ok`);

        // Cerrar la página firstPage
        await firstPage.close();
        await delay(500);

        // Recorro los ids y proceso
        for (const id of ids) {
            const page = await browser.newPage();
            await page.goto(`${url}${id}`);
            // Tab automatización
            await page.click('#main-nav > li:nth-child(3) > a');
            // Toco popup
            await page.waitForSelector(`#${automationName} > button > span`);
            await page.click(`#${automationName} > button > span`);
            // Toco item volver a ejecutar
            await page.waitForSelector('body > div.ng-tns-c24-3.dropdown > ul > li:nth-child(3) > a');
            await page.evaluate(() => {
                document.querySelector('body > div.ng-tns-c24-3.dropdown > ul > li:nth-child(3) > a').click();
            });
            // Toco boton submit del modal
            await page.waitForSelector('body > app-cmp > modal-cmp > div.modal.show > div > div > div.modal-footer.ng-tns-c1-1.ng-star-inserted > button.btn-modal-submit.btn.float-right.btn-modal-send.ng-tns-c1-1.btn-primary.ng-star-inserted');
            await page.evaluate(() => {
                document.querySelector('body > app-cmp > modal-cmp > div.modal.show > div > div > div.modal-footer.ng-tns-c1-1.ng-star-inserted > button.btn-modal-submit.btn.float-right.btn-modal-send.ng-tns-c1-1.btn-primary.ng-star-inserted').click();
            });
            await delay(500);
            // Tab Información
            await page.waitForSelector('#main-nav > li:nth-child(1) > a');
            await page.evaluate(() => {
                document.querySelector('#main-nav > li:nth-child(1) > a').click();
            });
            // Espero que cargue data
            await delay(1200);
            // Toco boton actualizar
            await page.waitForSelector('#containerTimeline > div > div.widget-header.d-flex > div > button:nth-child(3)');
            await page.evaluate(() => {
                document.querySelector('#containerTimeline > div > div.widget-header.d-flex > div > button:nth-child(3)').click();
            });
            // Espero para evaluar
            await delay(1000);
            
            // Evaluo resultado
            const result = await page.evaluate(() => {
                const timelineTitle = document.querySelector('#scrollTimeline > div > timeline-cmp > div > ul > li:nth-child(2) > div.timeline-event > div.timeline-heading.d-flex.justify-content-between.align-items-center > div > div.d-flex.mb-2 > div.timeline-title').innerText;
                const timelineSubtitle = document.querySelector('#scrollTimeline > div > timeline-cmp > div > ul > li:nth-child(2) > div.timeline-event > div.timeline-heading.d-flex.justify-content-between.align-items-center > div > div.d-flex.mb-2 > div.timeline-subtitle').innerText;

                return { timelineTitle, timelineSubtitle };
            });

            // Resultado ok
            if (result.timelineTitle === 'Conversión subida en Google Ads' && result.timelineSubtitle === `Hace unos segundos - ${dateControl}`) {
                console.dir('ID: '+id+' --> OK', 'color: green;');
                results.push({ id, result: 'OK' });
            } else if (result.timelineTitle === 'Error al subir conversión en Google Ads') {
                console.dir('ID: '+id+' --> FALLO', 'color: red;');
                results.push({ id, result: 'FALLO' });
            }

            // delay final
            await delay(500);
        }

    } catch (error) {
        console.error(`Error: ${error}`);
    }

}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

automate();
