#!/usr/bin/env node

pkgname=AutoDriveCheck
pkgver=1.0.0
pkgrel=1
pkgdesc="Script para verificar drivers essenciais e sugerir instalação automática no Linux"
arch=('x86_64')
url="https://github.com/Facelless/AutoDriveCheck"
license=('MIT')
depends=('nodejs' 'npm' 'pciutils' 'usbutils')

package() {
    install -Dm755 "$srcdir/AutoDriveCheck-${pkgver}/index.js" "$pkgdir/usr/bin/driver-checker"
    install -Dm644 "$srcdir/AutoDriveCheck-${pkgver}/config/config.json" "$pkgdir/usr/share/${pkgname}/config/config.json"
    install -Dm644 "$srcdir/AutoDriveCheck-${pkgver}/config/ditros.json" "$pkgdir/usr/share/${pkgname}/config/ditros.json"
    npm install --prefix "$pkgdir/usr/lib/${pkgname}" cli-table3
}

