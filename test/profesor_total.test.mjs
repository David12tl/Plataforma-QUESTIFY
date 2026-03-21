import { Builder, By, until } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge.js';

async function profesorSuperFlow() {
  const options = new edge.Options();
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--remote-allow-origins=*');

  const driver = await new Builder()
    .forBrowser('MicrosoftEdge')
    .setEdgeOptions(options)
    .build();

  // Datos dinámicos para evitar duplicados en tu base de datos de Supabase
  const NOMBRE_MATERIA = `Clase Master ${Math.floor(Math.random() * 999)}`;
  const TAREA_NOMBRE = `Proyecto Final ${Date.now()}`;
  const TAREA_EDITADA = `${TAREA_NOMBRE} (Actualizado)`;

  try {
    console.log("🚀 INICIANDO SUPER TEST: LOGIN -> CLASES -> TAREAS -> ANUNCIOS");

    // --- 1. LOGIN ---
    await driver.get('http://localhost:3000/auth/login');
    await driver.findElement(By.name('email')).sendKeys('david12tl@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');
    await driver.findElement(By.xpath("//button[contains(text(), 'Ingresar')]")).click();

    // --- 2. NAVEGACIÓN VÍA NAVBAR ---
    console.log("🧭 Usando Navbar para entrar al sistema...");
    const linkEntrar = await driver.wait(
      until.elementLocated(By.xpath("//nav//a[contains(text(), 'ENTRAR')]")), 
      10000
    );
    await linkEntrar.click();

    // --- 3. MÓDULO DE CLASES: CREACIÓN ---
    console.log("📂 Accediendo al Módulo de Clases...");
    await driver.get('http://localhost:3000/sistema/profesor/clases');

    const btnNuevaClase = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Nueva Clase')]")), 
      10000
    );
    await btnNuevaClase.click();

    console.log(`📝 Configurando materia: ${NOMBRE_MATERIA}`);
    const inputNom = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Ej. Diseño Gráfico II']")), 
      5000
    );
    await inputNom.sendKeys(NOMBRE_MATERIA);
    await driver.findElement(By.xpath("//button[contains(text(), 'Generar')]")).click();
    
    // Seleccionar la primera imagen de portada disponible
    const imagenes = await driver.findElements(By.css('button[onClick*="setSelectedImage"]'));
    if (imagenes.length > 0) await imagenes[0].click();
    
    await driver.findElement(By.xpath("//button[contains(text(), 'Crear Materia')]")).click();

    // --- 4. DETALLE DE CLASE: GESTIÓN DE TAREAS ---
    console.log("🖱️ Entrando a la materia recién creada...");
    const cardMateria = await driver.wait(
      until.elementLocated(By.xpath(`//h3[contains(text(), '${NOMBRE_MATERIA}')]/ancestor::a`)), 
      10000
    );
    await cardMateria.click();

    console.log("➕ Publicando nueva tarea...");
    const btnCrearTarea = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Crear Nueva Tarea')]")), 
      10000
    );
    await btnCrearTarea.click();

    await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Ej: Investigación de Layouts']")), 5000);
    await driver.findElement(By.xpath("//input[@placeholder='Ej: Investigación de Layouts']")).sendKeys(TAREA_NOMBRE);
    await driver.findElement(By.xpath("//textarea[@placeholder='Describe los pasos a seguir...']")).sendKeys("Tarea de prueba para monitoreo de anuncios.");
    
    const selectPrioridad = await driver.findElement(By.xpath("//select"));
    await selectPrioridad.sendKeys("alta");
    await driver.findElement(By.xpath("//button[contains(text(), 'Publicar Tarea')]")).click();

    // Esperar a que la tarea aparezca en la lista antes de editar
    await driver.wait(until.elementLocated(By.xpath(`//h3[contains(text(), '${TAREA_NOMBRE}')]`)), 10000);

    console.log("📝 Editando tarea para validar persistencia...");
    const btnEditar = await driver.findElement(By.xpath(`//h3[contains(text(), '${TAREA_NOMBRE}')]/ancestor::div[contains(@class, 'bg-white')]//button[contains(text(), 'Editar')]`));
    await btnEditar.click();

    const inputEdit = await driver.wait(until.elementLocated(By.xpath("//input[contains(@value, 'Proyecto Final')]")), 5000);
    await inputEdit.clear();
    await inputEdit.sendKeys(TAREA_EDITADA);
    await driver.findElement(By.xpath("//button[contains(text(), 'Guardar Cambios')]")).click();

    // --- 5. MONITOREO EN ANUNCIOS ---
    console.log("📢 Navegando a la sección de Anuncios y Rendimiento...");
    await driver.get('http://localhost:3000/sistema/profesor/anuncio');

    // Confirmación de carga de página (sin asignar a variable para evitar error de ESLint)
    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Actividades y Entregas')]")), 
      10000
    );

    console.log("📊 Verificando barra de progreso de la tarea editada...");
    const h3Anuncio = await driver.wait(
      until.elementLocated(By.xpath(`//h3[contains(text(), '${TAREA_EDITADA}')]`)), 
      10000
    );

    // Validar que la barra de progreso (naranja) esté presente en el DOM
    const barraProgreso = await h3Anuncio.findElement(By.xpath("./following-sibling::div//div[contains(@class, 'bg-[#f97316]')]"));
    const isBarVisible = await barraProgreso.isDisplayed();

    if (isBarVisible) {
      console.log("✅ Barra de progreso renderizada correctamente.");
    }

    // --- 6. LIMPIEZA FINAL (Eliminar Tarea) ---
    // Volvemos a la clase para borrar la tarea de prueba
    console.log("🧹 Limpiando datos de prueba...");
    await driver.navigate().back(); // Regresa a la clase
    
    const btnEliminar = await driver.wait(
        until.elementLocated(By.xpath(`//h3[contains(text(), '${TAREA_EDITADA}')]/ancestor::div[contains(@class, 'bg-white')]//button[contains(text(), 'Eliminar')]`)),
        10000
    );
    await btnEliminar.click();

    await driver.wait(until.alertIsPresent());
    await driver.switchTo().alert().accept();

    console.log("🏆 TEST FINALIZADO CON ÉXITO: Flujo completo validado.");

  } catch (error) {
    console.error("❌ EL SUPER TEST FALLÓ:");
    console.error(error.message);
  } finally {
    // Cerramos el navegador tras una breve pausa
    setTimeout(async () => {
      await driver.quit();
      console.log("Navegador cerrado.");
    }, 2000);
  }
}

profesorSuperFlow();