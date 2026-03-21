import { Builder, By, until } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge.js';

async function testFlujoCompletoDocente() {
  const options = new edge.Options();
  // Configuración para evitar errores de entorno y permitir CORS
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--remote-allow-origins=*');

  const driver = await new Builder()
    .forBrowser('MicrosoftEdge')
    .setEdgeOptions(options)
    .build();

  // Datos dinámicos para la prueba
  const NOMBRE_MATERIA = `Materia Automatizada ${Math.floor(Math.random() * 999)}`;
  const TAREA_TITULO = `Tarea Inicial ${Date.now()}`;
  const TAREA_EDITADA = `${TAREA_TITULO} - ACTUALIZADA`;

  try {
    console.log("🚀 INICIANDO MEGA-TEST: GESTIÓN INTEGRAL DE CLASES Y TAREAS");

    // --- 1. AUTENTICACIÓN ---
    await driver.get('http://localhost:3000/auth/login');
    await driver.findElement(By.name('email')).sendKeys('david12tl@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');
    await driver.findElement(By.xpath("//button[contains(text(), 'Ingresar')]")).click();

    // --- 2. CREACIÓN DE MATERIA (ClassesPage) ---
    console.log("📂 Accediendo al Módulo de Clases...");
    await driver.wait(until.urlContains('/sistema'), 10000);
    await driver.get('http://localhost:3000/sistema/profesor/clases');

    const btnNuevaClase = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Nueva Clase')]")), 10000);
    await btnNuevaClase.click();

    console.log(`📝 Creando materia: ${NOMBRE_MATERIA}`);
    await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Ej. Diseño Gráfico II']")), 5000).sendKeys(NOMBRE_MATERIA);
    await driver.findElement(By.xpath("//button[contains(text(), 'Generar')]")).click();
    
    // Seleccionar una imagen de la lista
    const imagenesPortada = await driver.findElements(By.xpath("//button[.//img]"));
    if (imagenesPortada.length > 0) await imagenesPortada[0].click();
    
    await driver.findElement(By.xpath("//button[contains(text(), 'Crear Materia')]")).click();

    // --- 3. NAVEGACIÓN AL DETALLE (ClaseDetallePage) ---
    console.log("🖱️ Entrando al detalle de la materia creada...");
    const cardMateria = await driver.wait(
      until.elementLocated(By.xpath(`//h3[contains(text(), '${NOMBRE_MATERIA}')]/ancestor::a`)), 
      15000
    );
    await cardMateria.click();

    // Verificar que el banner de la materia cargó con el nombre correcto
    await driver.wait(until.elementLocated(By.xpath(`//h1[contains(text(), '${NOMBRE_MATERIA}')]`)), 10000);
    console.log("✅ Navegación al ID de la clase exitosa.");

    // --- 4. GESTIÓN DE TAREAS (CRUD) ---
    console.log("➕ Abriendo modal de nueva tarea...");
    const btnNuevaTarea = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Crear Nueva Tarea')]")), 10000);
    await btnNuevaTarea.click();

    // Llenado del modal de tarea
    console.log("📝 Publicando tarea...");
    await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Ej: Investigación de Layouts']")), 5000).sendKeys(TAREA_TITULO);
    await driver.findElement(By.xpath("//textarea[@placeholder='Describe los pasos a seguir...']")).sendKeys("Descripción de prueba automatizada para el detalle de clase.");
    
    const selectPrioridad = await driver.findElement(By.xpath("//select"));
    await selectPrioridad.sendKeys("alta");
    
    await driver.findElement(By.xpath("//button[contains(text(), 'Publicar Tarea')]")).click();

    // Verificar aparición en la lista
    const cardTarea = await driver.wait(until.elementLocated(By.xpath(`//h3[contains(text(), '${TAREA_TITULO}')]`)), 10000);
    console.log("✅ Tarea publicada y visible en la lista.");

    // --- 5. EDICIÓN DE TAREA ---
    console.log("✏️ Probando edición de tarea...");
    const btnEditar = await driver.findElement(By.xpath(`//h3[contains(text(), '${TAREA_TITULO}')]/ancestor::div[contains(@class, 'bg-white')]//button[contains(text(), 'Editar')]`));
    await btnEditar.click();

    const inputTitulo = await driver.wait(until.elementLocated(By.xpath("//input[contains(@value, 'Tarea Inicial')]")), 5000);
    await inputTitulo.clear();
    await inputTitulo.sendKeys(TAREA_EDITADA);
    
    await driver.findElement(By.xpath("//button[contains(text(), 'Guardar Cambios')]")).click();
    await driver.wait(until.elementLocated(By.xpath(`//h3[contains(text(), '${TAREA_EDITADA}')]`)), 10000);
    console.log("✅ Tarea editada correctamente.");

    // --- 6. ELIMINACIÓN DE TAREA ---
    console.log("🗑️ Probando eliminación de tarea...");
    const btnEliminar = await driver.findElement(By.xpath(`//h3[contains(text(), '${TAREA_EDITADA}')]/ancestor::div[contains(@class, 'bg-white')]//button[contains(text(), 'Eliminar')]`));
    await btnEliminar.click();

    // Manejar el alert nativo del navegador (confirm)
    await driver.wait(until.alertIsPresent());
    const alert = await driver.switchTo().alert();
    await alert.accept();
    
    // Verificar desaparición (staleness)
    await driver.wait(until.stalenessOf(cardTarea), 10000);
    console.log("✅ Tarea eliminada y removida de la UI.");

    console.log("🏆 MEGA-TEST FINALIZADO CON ÉXITO: TODO EL FLUJO FUNCIONA");

  } catch (error) {
    console.error("❌ EL TEST FALLÓ EN ALGÚN PUNTO:");
    console.error(error.message);
  } finally {
    // Breve espera antes de cerrar para observar el resultado final
    setTimeout(async () => {
      await driver.quit();
      console.log("Navegador cerrado.");
    }, 2000);
  }
}

testFlujoCompletoDocente();