import { Builder, By, until } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge.js';

async function testPanelCalificaciones() {
  const options = new edge.Options();
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--remote-allow-origins=*');

  const driver = await new Builder()
    .forBrowser('MicrosoftEdge')
    .setEdgeOptions(options)
    .build();

  try {
    console.log("🚀 INICIANDO TEST: PANEL DE CALIFICACIONES (GRADING)");

    // 1. LOGIN
    await driver.get('http://localhost:3000/auth/login');
    await driver.findElement(By.name('email')).sendKeys('david12tl@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');
    await driver.findElement(By.xpath("//button[contains(text(), 'Ingresar')]")).click();

    // 2. NAVEGACIÓN A GRADING
    console.log("📂 Navegando al panel de calificaciones...");
    await driver.wait(until.urlContains('/sistema'), 10000);
    // Asumiendo que tu ruta es /sistema/grading
    await driver.get('http://localhost:3000/sistema/profesor/grading');

    // 3. ESPERAR CARGA DE DATOS
    console.log("⏳ Esperando respuesta de Supabase...");
    await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Panel de Calificaciones')]")), 10000);

    // Verificar si hay entregas para calificar
    const entregas = await driver.findElements(By.xpath("//section"));

    if (entregas.length === 0) {
      console.log("⚠️ No hay entregas registradas para calificar actualmente.");
      return;
    }

    console.log(`✅ Se detectaron ${entregas.length} materias con entregas.`);

    // 4. PRUEBA DE EDICIÓN (Cambiar nota)
    console.log("📝 Probando cambio de calificación...");
    
    // Localizar el primer input de calificación
    const primerInput = await driver.wait(until.elementLocated(By.css("input[type='number']")), 10000);
    const valorOriginal = await primerInput.getAttribute('value');
    
    // Limpiar y escribir nueva nota
    await primerInput.clear();
    await primerInput.sendKeys("95");

    // 5. VALIDAR ESTADO DEL BOTÓN "GUARDAR"
    console.log("🔘 Verificando que el botón se habilite al editar...");
    // El botón cambia de "Sin cambios" a "Guardar" y cambia el color de fondo
    const btnGuardar = await driver.findElement(By.xpath("//button[contains(., 'Guardar')]"));
    const estaHabilitado = await btnGuardar.isEnabled();
    
    if (estaHabilitado) {
      console.log("✅ Botón de guardado activado correctamente.");
    } else {
      throw new Error("El botón no se habilitó después de cambiar la nota.");
    }

    // 6. CAMBIAR ESTADO (Select)
    console.log("🔄 Cambiando estado de la entrega...");
    const selectEstado = await driver.findElement(By.xpath("//select"));
    await selectEstado.click();
    await selectEstado.findElement(By.xpath("//option[@value='calificado']")).click();

    // 7. EJECUTAR GUARDADO Y ALERT
    console.log("💾 Guardando cambios en Supabase...");
    await btnGuardar.click();

    // Esperar y aceptar el alert de éxito
    await driver.wait(until.alertIsPresent(), 10000);
    const alert = await driver.switchTo().alert();
    const textoAlert = await alert.getText();
    console.log(`🔔 Mensaje del sistema: ${textoAlert}`);
    await alert.accept();

    // 8. VERIFICAR PERSISTENCIA
    await driver.sleep(2000); // Pausa para recarga de loadEntregas()
    const nuevoValor = await primerInput.getAttribute('value');
    console.log(`📊 Valor original: ${valorOriginal} -> Nuevo valor persistido: ${nuevoValor}`);

    console.log("🏆 TEST DE CALIFICACIONES COMPLETADO CON ÉXITO");

  } catch (error) {
    console.error("❌ ERROR EN EL TEST DE GRADING:");
    console.error(error.message);
  } finally {
    setTimeout(async () => {
      await driver.quit();
      console.log("Navegador cerrado.");
    }, 2000);
  }
}

testPanelCalificaciones();