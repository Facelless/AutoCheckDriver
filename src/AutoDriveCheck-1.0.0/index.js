#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const Table = require('/usr/lib/AutoDriveCheck/node_modules/cli-table3');


const essentialDrivers = JSON.parse(fs.readFileSync("/usr/share/AutoDriveCheck/config/config.json", "utf8")).essentialDrivers;
const distros = JSON.parse(fs.readFileSync("/usr/share/AutoDriveCheck/config/ditros.json", "utf8")).distros;

const runCommand = (command) => {
    try {
        return execSync(command, { stdio: "pipe" }).toString().trim().toLowerCase();
    } catch {
        return null;
    }
};

const detectDistro = () => {
    const osRelease = runCommand("cat /etc/os-release") || "";
    
    for (const distro of distros) {
        if (distro.keywords.some(keyword => osRelease.includes(keyword))) {
            return { name: distro.name, manager: distro.manager };
        }
    }

    return { name: "Desconhecida", manager: null };
};

const getHardwareInfo = () => {
    const gpuOutput = runCommand('lspci | grep -i "vga\\|3d"');
    let gpuType = "desconhecido";
    if (gpuOutput.includes("nvidia")) gpuType = "nvidia";
    else if (gpuOutput.includes("amd") || gpuOutput.includes("ati")) gpuType = "amd";
    else if (gpuOutput.includes("intel")) gpuType = "intel";

    const networkOutput = runCommand('lspci | grep -i "network\\|ethernet"');
    let networkType = "desconhecido";
    if (networkOutput.includes("realtek")) networkType = "realtek";
    else if (networkOutput.includes("intel")) networkType = "intel";
    else if (networkOutput.includes("broadcom")) networkType = "broadcom";
    else if (networkOutput.includes("qualcomm") || networkOutput.includes("atheros")) networkType = "qualcomm";
    else if (networkOutput.includes("mediatek")) networkType = "mediatek";
    else if (networkOutput.includes("marvell")) networkType = "marvell";

    return { gpuType, networkType };
};

const checkDrivers = async () => {
    console.log("\n🔍 Verificando sistema...\n");

    const distro = detectDistro();
    console.log(`🖥️  Distribuição detectada: ${distro.name}`);
    if (!distro.manager) {
        console.log("❌ Gerenciador de pacotes não identificado. Saindo...");
        return;
    }

    const { gpuType, networkType } = getHardwareInfo();
    console.log(`🎮 Placa de Vídeo: ${gpuType.toUpperCase()}`);
    console.log(`🌐 Adaptador de Rede: ${networkType.toUpperCase()}`);

    const compatibleDrivers = essentialDrivers.filter(driver => {
        if (driver.keyword.includes(gpuType)) return true;
        if (driver.keyword.includes(networkType)) return true;
        if (["usb", "bluetooth", "storage", "nvme", "sata", "audio", "snd"].some(keyword => driver.keyword.includes(keyword))) {
            return true;
        }
        return false;
    });

    console.log("\n✅ Verificando drivers compatíveis...\n");

    const loadedModules = runCommand("lsmod") || "";

    const table = new Table({
        head: ["Driver", "Módulo", "Status", "Instalação"],
        colWidths: [30, 20, 15, 38],
        style: { head: ["cyan"] }
    });

    compatibleDrivers.forEach(driver => {
        const isLoaded = loadedModules.includes(driver.keyword);
        const status = isLoaded ? "✅ Carregado" : "❌ Não Carregado";
        const installCommand = isLoaded ? "-" : `sudo ${distro.manager} ${driver.keyword}`;
        table.push([driver.name, driver.keyword, status, installCommand]);
    });

    console.log(table.toString());

}

checkDrivers();

