import { Builder, By, until } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge.js';


async function runLoginTest() {

  const options = new edge.Options();

  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--remote-allow-origins=*');
  
 
  const driver = await new Builder()
    .forBrowser('MicrosoftEdge')
    .setEdgeOptions(options)
    .build();

  try {
    console.log("Iniciando prueba en Microsoft Edge...");

  
    await driver.get('http://localhost:3000/auth/login');
    console.log(`URL cargada: ${await driver.getCurrentUrl()}`);


    console.log("Esperando a que cargue el formulario...");
    const emailInput = await driver.wait(
      until.elementLocated(By.name('email')), 
      10000,
      'No se encontró el campo de email (timeout)'
    );

   
    console.log("Escribiendo credenciales...");
    
    await emailInput.sendKeys('david12tl@gmail.com');
    
   
    await driver.findElement(By.name('password')).sendKeys('12345678');

  
    console.log("Haciendo clic en el botón 'Ingresar'...");
    
    
    const loginButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Ingresar')]")
    );
    await loginButton.click();

    
    console.log("Verificando redirección a /sistema...");
    

    await driver.wait(
      until.urlContains('/sistema'), 
      15000, 
      'La redirección a /sistema falló o tardó demasiado'
    );
    
    const finalUrl = await driver.getCurrentUrl();
    console.log(`TEST EXITOSO: Sesión iniciada y redirigido a ${finalUrl}`);

  } catch (error) {
    
    console.error(" TEST FALLIDO:", error.message);
  } finally {
   
    setTimeout(async () => {
      await driver.quit();
      console.log("Navegador cerrado.");
    }, 2000);
  }
}

// Ejecutar la prueba
runLoginTest();