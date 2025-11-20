# AutoCheckDriver

AutoCheckDriver é um script para Linux que verifica drivers essenciais do sistema e sugere a instalação automática de pacotes necessários.

## Instalação

### Instalação Manual
```bash
git clone https://github.com/Facelless/AutoCheckDriver.git
cd AutoCheckDriver
makepkg -si
```

## Como Usar

Após a instalação, basta executar o comando:
```bash
driver-checker
```
O script irá analisar seu sistema e sugerir pacotes essenciais para os drivers de hardware.

## Dependências

O **AutoDriveCheck** requer os seguintes pacotes:
- `nodejs`
- `npm`
- `pciutils`
- `usbutils`
- `cli-table3` (instalado automaticamente)

## Contribuição

Sinta-se à vontade para contribuir com melhorias e correções! Basta clonar o repositório e enviar um pull request.
