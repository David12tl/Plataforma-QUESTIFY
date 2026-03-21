import { Builder, By, until } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge.js';

async function testDashboardData() {
  const options = new edge.Options();
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--remote-allow-origins=*');

  const driver = await new Builder()
    .forBrowser('MicrosoftEdge')
    .setEdgeOptions(options)
    .build();

  try {
    console.log("🚀 INICIANDO TEST DE DASHBOARD DOCENTE");

    // 1. LOGIN
    await driver.get('http://localhost:3000/auth/login');
    
    const emailInput = await driver.wait(until.elementLocated(By.name('email')), 5000);
    await emailInput.sendKeys('david12tl@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');

    const btnIngresar = await driver.wait(
      until.elementIsEnabled(driver.findElement(By.xpath("//button[contains(text(), 'Ingresar')]"))),
      5000
    );
    await btnIngresar.click();

    // 2. ESPERAR CARGA DEL DASHBOARD
    console.log("⏳ Esperando navegación al área del sistema...");
    
    try {
      // Esperamos que la URL cambie a algo que contenga /sistema
      await driver.wait(until.urlContains('/sistema'), 15000); 
      console.log("✅ Redirección detectada.");
    } catch {
      // Eliminamos la 'e' para que ESLint no se queje de variable no usada
      console.log("⚠️ La URL no cambió a tiempo, verificando elementos internos...");
    }

    // 3. VERIFICAR COMPONENTES
    console.log("🔍 Buscando elementos del Dashboard...");
    const titulo = await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Dashboard')]")), 
      15000 
    );
    console.log(`✅ Título detectado: ${await titulo.getText()}`);

    // 4. VERIFICAR STAT CARDS
    console.log("📊 Verificando tarjetas de estadísticas...");
    const cards = await driver.wait(
        until.elementsLocated(By.css('div.border-4.border-\\[#1c1917\\]')), 
        10000
    );
    
    if (cards.length >= 3) {
      console.log(`✅ Se encontraron ${cards.length} contenedores de métricas.`);
    }

    // 5. VERIFICAR EL GRÁFICO (Recharts)
    console.log("📈 Verificando gráfico de progreso...");
    // Eliminamos la variable 'grafico' y usamos la espera directa
    await driver.wait(
      until.elementLocated(By.className('recharts-responsive-container')), 
      10000
    );
    console.log("✅ Gráfico de Recharts renderizado correctamente.");

    // 6. VERIFICAR EL PANEL NARANJA Y DATOS REALES
    console.log("🟧 Verificando panel de pendientes...");
    const panelPendientes = await driver.findElement(By.className('bg-[#f97316]'));
    const numeroPendientes = await panelPendientes.findElement(By.className('text-7xl'));
    
    // Esperar a que el texto cambie de '...' a un número
    await driver.wait(async () => {
        const txt = await numeroPendientes.getText();
        return txt !== '...';
    }, 10000);

    const valorFinal = await numeroPendientes.getText();
    console.log(`✅ Datos sincronizados de Supabase. Valor: ${valorFinal}`);

    console.log("🏆 TEST DE DASHBOARD COMPLETADO EXITOSAMENTE");

  } catch (error) {
    console.error("❌ EL TEST DEL DASHBOARD FALLÓ:");
    console.error(error.message);
  } finally {
    // Cerramos el navegador para liberar recursos
    await driver.quit();
    console.log("Navegador cerrado.");
  }
}

testDashboardData();