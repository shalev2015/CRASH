namespace SpriteKind {
    export const prompt = SpriteKind.create()
    export const extra = SpriteKind.create()
    export const delayer = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.extra, function (s, o) {
    o.destroy()
    info.setScore(info.score() * 2)
})
function setVolume () {
    music.stopAllSounds()
    music.setVolume(volume)
    music.play(music.tonePlayable(262, 500), music.PlaybackMode.UntilDone)
    volumeDiagram = fancyText.create(convertToText(volume), 0, 8, fancyText.rounded_large)
    volumeDiagram.setPosition(80, 60)
    pauseUntil(() => controller.B.isPressed() || controller.left.isPressed() || controller.right.isPressed())
    sprites.destroy(volumeDiagram)
    if (controller.right.isPressed() && volume < 245) {
        volume += 10
    }
    if (controller.left.isPressed() && volume > 8) {
        volume += 0 - 10
    }
    if (controller.B.isPressed()) {
        music.play(music.createSong(assets.song`music`), music.PlaybackMode.LoopingInBackground)
    } else {
        setVolume()
    }
}
function menu () {
    color.startFadeFromCurrent(color.Black)
    color.pauseUntilFadeDone()
    isMenu = 0
    if (playerSprite) {
        sprites.destroy(playerSprite)
    }
    if (shopTitle) {
        sprites.destroy(shopTitle)
    }
    if (myMenu) {
        myMenu.close()
    }
    if (myMenu3) {
        myMenu3.close()
    }
    isPlaying = false
    info.setScore(0)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.extra)
    myTextSprite = fancyText.create("Crash!", 0, 13, fancyText.gothic_large)
    myTextSprite.z = 100
    myTextSprite.y = 30
    titleScreen = image.create(160, 120)
    titleScreen.fill(7)
    titleScreen.fillRect(35, 0, 90, 120, 12)
    for (let i = 0; i < 120; i += 16) {
        titleScreen.fillRect(78, i, 4, 8, 5)
    }
titleScreen.fillRect(52, 12, 16, 22, 8)
    titleScreen.fillRect(50, 14, 2, 5, 15)
    titleScreen.fillRect(68, 14, 2, 5, 15)
    titleScreen.fillRect(50, 26, 2, 5, 15)
    titleScreen.fillRect(68, 26, 2, 5, 15)
    titleScreen.fillRect(54, 15, 12, 4, 1)
    titleScreen.fillRect(92, 45, 16, 22, 5)
    titleScreen.fillRect(90, 47, 2, 5, 15)
    titleScreen.fillRect(108, 47, 2, 5, 15)
    titleScreen.fillRect(90, 59, 2, 5, 15)
    titleScreen.fillRect(108, 59, 2, 5, 15)
    titleScreen.fillRect(94, 48, 12, 4, 1)
    titleScreen.fillRect(52, 82, 16, 24, 2)
    titleScreen.fillRect(50, 85, 2, 6, 15)
    titleScreen.fillRect(68, 85, 2, 6, 15)
    titleScreen.fillRect(50, 97, 2, 6, 15)
    titleScreen.fillRect(68, 97, 2, 6, 15)
    titleScreen.fillRect(54, 85, 12, 5, 1)
    scene.setBackgroundImage(titleScreen)
    scroller.scrollBackgroundWithSpeed(0, 50)
    myMenu2 = miniMenu.createMenu(
    miniMenu.createMenuItem("play/shop", assets.image`play`),
    miniMenu.createMenuItem("how to play", assets.image`questionMark`),
    miniMenu.createMenuItem("volume", assets.image`volume`)
    )
    color.startFadeFromCurrent(color.originalPalette)
    myMenu2.onButtonPressed(controller.A, function (selection, index) {
        if (index == 0) {
            level()
        } else if (index == 1) {
            game.showLongText("Dodge blue cars, collect coins and clocks!", DialogLayout.Center)
        } else if (index == 2) {
            setVolume()
        }
    })
}
function level () {
    color.startFadeFromCurrent(color.Black)
    color.pauseUntilFadeDone()
    myMenu2.close()
    sprites.destroy(myTextSprite)
    isMenu = 1
    myMenu3 = miniMenu.createMenu(
    miniMenu.createMenuItem("Level 1"),
    miniMenu.createMenuItem("Level 2"),
    miniMenu.createMenuItem("Level 3"),
    miniMenu.createMenuItem("Level 4")
    )
    color.startFadeFromCurrent(color.originalPalette)
    myMenu3.onButtonPressed(controller.A, function (selection, index) {
        maxCars = index + 3
        shop()
    })
}
function list () {
    let menuItems: miniMenu.MenuItem[] = []
    if (myMenu) {
        sprites.destroy(myMenu)
    }
    for (let j = 0; j <= status.length - 1; j++) {
        menuItems.push(miniMenu.createMenuItem(status[j], carImgs[j]))
    }
    myMenu = miniMenu.createMenuFromArray(menuItems)
    total += info.score()
    info.setScore(0)
    myMenu.setTitle("" + total + "$")
    myMenu.setFrame(assets.image`city`)
    myMenu.z = 1
    myMenu.x = 80
    if (playerSprite) {
        playerSprite.x = 80
    }
    myMenu.onButtonPressed(controller.A, function (selection, index) {
        music.play(music.melodyPlayable(music.knock), music.PlaybackMode.UntilDone)
        if (status[index] != "owned") {
            if (total >= prices[index]) {
                total += 0 - prices[index]
                status[index] = "owned"
                list()
            }
        } else {
            car = carImgs[index]
            carType = index + 1
            play()
        }
    })
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.delayer, function (s, o) {
    o.destroy()
    screenSpeed = Math.max(10, screenSpeed - 20)
})
function play () {
    color.startFadeFromCurrent(color.Black)
    color.pauseUntilFadeDone()
    myMenu.close()
    sprites.destroy(shopTitle)
    screenSpeed = 10
    playerSprite = sprites.create(car, SpriteKind.Player)
    playerSprite.setStayInScreen(true)
    playerSprite.setPosition(80, 110)
    controller.moveSprite(playerSprite, 100, 0)
    isPlaying = true
    color.startFadeFromCurrent(color.originalPalette)
}
info.onCountdownEnd(function () {
    info.changeScoreBy(total)
})
function shop () {
    color.startFadeFromCurrent(color.Black)
    color.pauseUntilFadeDone()
    if (explosion) {
        sprites.destroy(explosion)
        sprites.destroy(ambulance)
    }
    if (myMenu3) {
        myMenu3.close()
    }
    scene.setBackgroundImage(assets.image`road`)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    shopTitle = sprites.create(assets.image`shop`, SpriteKind.prompt)
    shopTitle.y = 10
    list()
    color.startFadeFromCurrent(color.originalPalette)
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (isMenu != 0) {
        menu()
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, other) {
    isPlaying = false
    screenSpeed = 0
    scroller.scrollBackgroundWithSpeed(0, screenSpeed)
    explosion = sprites.create(assets.image`explosion`, SpriteKind.prompt)
    explosion.setPosition(sprite.x, sprite.y)
    sprite.destroy(effects.fire, 500)
    ambulance = sprites.create(assets.image`ambulance`, SpriteKind.prompt)
    ambulance.follow(explosion)
    animation.runImageAnimation(
    explosion,
    assets.animation`explosionAnim`,
    500,
    false
    )
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.InBackground)
    pause(2000)
    shop()
})
function spawnItem (img2: Image, kind: number) {
    s = sprites.create(img2, kind)
    if (!(isPlaying)) {
        s.destroy()
        return s
    }
    s.setPosition(randint(0, 1) == 0 ? randint(6, 69) : randint(91, 154), 0)
    s.setVelocity(0, screenSpeed + 10)
    s.setFlag(SpriteFlag.AutoDestroy, true)
    return s
}
sprites.onDestroyed(SpriteKind.Enemy, function (sprite) {
    info.changeScoreBy(carType)
})
let enemyCar: Sprite = null
let s: Sprite = null
let ambulance: Sprite = null
let explosion: Sprite = null
let total = 0
let myMenu2: miniMenu.MenuSprite = null
let myTextSprite: fancyText.TextSprite = null
let isPlaying = false
let myMenu3: miniMenu.MenuSprite = null
let myMenu: miniMenu.MenuSprite = null
let shopTitle: Sprite = null
let playerSprite: Sprite = null
let isMenu = 0
let volumeDiagram: fancyText.TextSprite = null
let status: string[] = []
let carImgs: Image[] = []
let prices: number[] = []
let maxCars = 0
let car: Image = null
let carType = 0
let screenSpeed = 0
let volume = 0
let titleScreen: Image = null
volume = 128
screenSpeed = 10
carType = 1
car = assets.image`redCar`
maxCars = 1
prices = [
0,
100,
1000,
10000
]
carImgs = [
assets.image`redCar`,
assets.image`pinkCar`,
assets.image`americaCar`,
assets.image`golfCart`
]
status = [
"owned",
"100$",
"1,000$",
"10,000$"
]
music.play(music.createSong(assets.song`music`), music.PlaybackMode.LoopingInBackground)
info.startCountdown(1200)
menu()
forever(function () {
    if (isPlaying) {
        enemyCar = spawnItem(assets.image`enemyCar`, SpriteKind.Enemy)
        enemyCar.vy = screenSpeed + 20
        pause(135 / enemyCar.vy / maxCars * 1000)
    }
    pause(100)
})
game.onUpdateInterval(6000, function () {
    spawnItem(assets.image`coin`, SpriteKind.extra)
})
game.onUpdateInterval(100, function () {
    if (isPlaying) {
        screenSpeed += 1
        scroller.scrollBackgroundWithSpeed(0, screenSpeed)
        for (let t of sprites.allOfKind(SpriteKind.Projectile)) {
            t.vy = screenSpeed + 20
        }
    }
})
game.onUpdateInterval(8000, function () {
    spawnItem(assets.image`clock`, SpriteKind.delayer)
})
