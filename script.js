// SCRIPT FINAL DA RESULTADOS OK O FALLO

const puppeteer = require('puppeteer-core');

const ids = [
  38268,
  38263,
  38258,
  38257,
  38206,
  38204,
  38197,
  38188,
  38185,
  38181,
  38177,
  38171,
  38155,
  38152,
  38151,
  38144,
  38140,
  38114,
  38105,
  38091,
  38089,
  38088,
  38083,
  38076,
  38070,
  38069
];

const url = 'https://grupomasmovil.inconcertcc.com/mas/contact/people/view/';

const user = 'Matias';
const pass = 'Matias12/';

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
            await page.waitForSelector('#LeadBruto900_C-G-TELECABLE > button > span');
            await page.click('#LeadBruto900_C-G-TELECABLE > button > span');
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
            await delay(700);
            
            // Evaluo resultado
            const result = await page.evaluate(() => {
                const timelineTitle = document.querySelector('#scrollTimeline > div > timeline-cmp > div > ul > li:nth-child(2) > div.timeline-event > div.timeline-heading.d-flex.justify-content-between.align-items-center > div > div.d-flex.mb-2 > div.timeline-title').innerText;
                const timelineSubtitle = document.querySelector('#scrollTimeline > div > timeline-cmp > div > ul > li:nth-child(2) > div.timeline-event > div.timeline-heading.d-flex.justify-content-between.align-items-center > div > div.d-flex.mb-2 > div.timeline-subtitle').innerText;

                return { timelineTitle, timelineSubtitle };
            });

            // Resultado ok
            if (result.timelineTitle === 'Conversión subida en Google Ads' && result.timelineSubtitle === 'Hace unos segundos - 29/06/2023') {
                console.dir('ID: '+id+' --> OK', 'color: green;');
                results.push({ id, result: 'OK' });
            } else if (result.timelineTitle === 'Error al subir conversión en Google Ads') {
                console.dir('ID: '+id+' --> FALLO', 'color: red;');
                results.push({ id, result: 'FALLO' });
            }

            // delay final
            await delay(1000);
        }

    } catch (error) {
        console.error(`Error: ${error}`);
    }

}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

automate();
