import { Builder, By, until } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge.js';

async function testSeccionEstudiantes() {
  const options = new edge.Options();
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--remote-allow-origins=*');

  const driver = await new Builder()
    .forBrowser('MicrosoftEdge')
    .setEdgeOptions(options)
    .build();

  try {
    console.log("🚀 INICIANDO TEST: LISTADO DE ESTUDIANTES POR CLASE");

    // 1. LOGIN (Necesario para tener sesión y ver inscripciones)
    await driver.get('http://localhost:3000/auth/login');
    await driver.findElement(By.name('email')).sendKeys('david12tl@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');
    await driver.findElement(By.xpath("//button[contains(text(), 'Ingresar')]")).click();

    // 2. NAVEGACIÓN A ESTUDIANTES
    console.log("📂 Navegando a la sección de Estudiantes...");
    await driver.wait(until.urlContains('/sistema'), 10000);
    // Ajusta la URL según tu estructura de carpetas (ej: /sistema/estudiantes)
    await driver.get('http://localhost:3000/sistema/profesor/estudiantes');

    // 3. VALIDAR ESTADO DE CARGA
    console.log("⏳ Verificando sincronización de registros...");
    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Estudiantes por Clase')]")), 
      10000
    );

    // 4. VALIDAR RENDERIZADO DE TABLAS
    // Esperamos a que el loading desaparezca y aparezca o una sección de clase o el mensaje de "No hay estudiantes"
    const contenidoCargado = await driver.wait(
      until.elementOrLocated(By.xpath("//section[contains(@class, 'bg-white')] | //p[contains(text(), 'No hay estudiantes')]")),
      15000
    );

    const textoContenido = await contenidoCargado.getText();

    if (textoContenido.includes("No hay estudiantes")) {
      console.log("⚠️ La base de datos está vacía, pero la UI maneja correctamente el estado vacío.");
    } else {
      console.log("✅ Se detectaron secciones de clases con estudiantes.");

      // 5. VALIDAR ESTRUCTURA DE LA TABLA (Materia, Alumnos y Datos)
      const primeraMateria = await driver.findElement(By.xpath("//section//h3"));
      const nombreMateria = await primeraMateria.getText();
      
      const contadorAlumnos = await driver.findElement(By.xpath("//section//span[contains(text(), 'Alumnos')]")).getText();
      
      console.log(`📊 Materia detectada: ${nombreMateria}`);
      console.log(`👥 Conteo: ${contadorAlumnos}`);

      // 6. VALIDAR DATOS DE UN ESTUDIANTE
      const primerEstudiante = await driver.findElement(By.xpath("//tbody/tr[1]/td[1]"));
      const emailEstudiante = await driver.findElement(By.xpath("//tbody/tr[1]/td[2]"));
      
      console.log(`👤 Primer estudiante en lista: ${await primerEstudiante.getText()} (${await emailEstudiante.getText()})`);
      
      // 7. PRUEBA DE HOVER / ACCIÓN
      const btnPerfil = await driver.findElement(By.xpath("//button[contains(text(), 'Ver Perfil')]"));
      const esClickeable = await btnPerfil.isEnabled();
      
      console.log(`🖱️ Botón 'Ver Perfil' operativo: ${esClickeable ? 'SÍ' : 'NO'}`);
    }

    console.log("🏆 TEST DE ESTUDIANTES FINALIZADO EXITOSAMENTE");

  } catch (error) {
    console.error("❌ EL TEST DE ESTUDIANTES FALLÓ:");
    console.error(error.message);
  } finally {
    setTimeout(async () => {
      await driver.quit();
      console.log("Navegador cerrado.");
    }, 2000);
  }
}

testSeccionEstudiantes();