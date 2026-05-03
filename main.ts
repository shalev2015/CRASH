namespace SpriteKind {
    export const prompt = SpriteKind.create()
    export const extra = SpriteKind.create()
    export const delayer = SpriteKind.create()
}
function menu () {
    info.setScore(0)
    if (myMenu) {
        myMenu.close()
        sprites.destroy(myMenu)
    }
    if (mySprite) {
        sprites.destroy(mySprite)
    }
    if (coin) {
        sprites.destroy(coin)
    }
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
    title = fancyText.create("Crash!", 0, 13, fancyText.gothic_large)
    title.setPosition(80, 30)
    screenSpeed = 10
    scroller.scrollBackgroundWithSpeed(0, screenSpeed)
    pink = "100$"
    America = "1,000$"
    golfCart = "10,000$"
    isPlaying = false
    myMenu2 = miniMenu.createMenu(
    miniMenu.createMenuItem("play/shop", assets.image`play`),
    miniMenu.createMenuItem("how to play", assets.image`questionMark`)
    )
    myMenu2.onSelectionChanged(function (selection, selectedIndex) {
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.UntilDone)
    })
    myMenu2.onButtonPressed(controller.A, function (selection, selectedIndex) {
        if (selectedIndex == 0) {
            sprites.destroy(title)
            level()
        } else if (selectedIndex == 1) {
            game.showLongText("Hello there. Welcome to CRASH!, the game for showing off your driving skills. To play the game, you must dodge the blue cars. If you CRASH! into a coin, you will get a money boost. If you CRASH! into a clock, you will slow  down. Good luck!", DialogLayout.Center)
        }
    })
}
controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    Notification.cancelNotification()
})
function level () {
    color.startFade(color.originalPalette, color.Black, 1000)
    pause(1000)
    myMenu2.close()
    myMenu3 = miniMenu.createMenu(
    miniMenu.createMenuItem("level 1 (regular)"),
    miniMenu.createMenuItem("level 2 (hard)"),
    miniMenu.createMenuItem("level 3 (impossible)"),
    miniMenu.createMenuItem("level 4 (ludicrous)")
    )
    myMenu3.setTitle("Select Level (1-4)")
    color.startFade(color.Black, color.originalPalette, 1000)
    myMenu3.onButtonPressed(controller.A, function (selection, selectedIndex) {
        if (selectedIndex == 0) {
            maxCars = 3
        } else if (selectedIndex == 1) {
            maxCars = 4
        } else if (selectedIndex == 2) {
            maxCars = 5
        } else if (selectedIndex == 3) {
            maxCars = 6
        }
        shop()
    })
}
function list () {
    if (myMenu) {
        sprites.destroy(myMenu)
    }
    listOfCars = [
    miniMenu.createMenuItem("owned", assets.image`redCar`),
    miniMenu.createMenuItem(pink, assets.image`pinkCar`),
    miniMenu.createMenuItem(America, assets.image`americaCar`),
    miniMenu.createMenuItem(golfCart, assets.image`golfCart`)
    ]
    myMenu = miniMenu.createMenuFromArray(listOfCars)
    total = total + info.score()
    myMenu.setTitle("" + total + "$")
    myMenu.setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Alignment, 1)
    info.setScore(0)
    myMenu.setFrame(assets.image`city`)
    myMenu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 9)
    myMenu.z = 1
    myMenu.x = 80
    myMenu.onSelectionChanged(function (selection, selectedIndex) {
        music.play(music.melodyPlayable(music.thump), music.PlaybackMode.UntilDone)
    })
    myMenu.onButtonPressed(controller.A, function (selection, selectedIndex) {
        music.play(music.melodyPlayable(music.knock), music.PlaybackMode.UntilDone)
        if (selectedIndex == 0) {
            car = assets.image`redCar`
            carType = 1
            play()
        } else if (selectedIndex == 1) {
            if (pink == "100$") {
                if (total >= 100) {
                    pink = "owned"
                    total = total - 100
                    myMenu.close()
                    list()
                }
            } else {
                car = assets.image`pinkCar`
                carType = 2
                play()
            }
        } else if (selectedIndex == 2) {
            if (America == "1,000$") {
                if (total >= 1000) {
                    America = "owned"
                    total = total - 1000
                    myMenu.close()
                    list()
                }
            } else {
                car = assets.image`americaCar`
                carType = 3
                play()
            }
        } else if (selectedIndex == 3) {
            if (golfCart == "10,000$") {
                if (total >= 10000) {
                    golfCart = "owned"
                    total = total - 10000
                    myMenu.close()
                    list()
                }
            } else {
                car = assets.image`golfCart`
                carType = 4
                play()
            }
        }
    })
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.delayer, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    screenSpeed = Math.max(10, screenSpeed - 20)
})
function play () {
    color.startFadeFromCurrent(color.Black, 1000)
    pause(1000)
    myMenu.close()
    everyHowMuch = 500
    sprites.destroy(shopTitle)
    screenSpeed = 10
    pause(1000)
    mySprite = sprites.create(car, SpriteKind.Player)
    controller.moveSprite(mySprite, 100, 0)
    mySprite.setStayInScreen(true)
    mySprite.setPosition(80, 110)
    color.startFadeFromCurrent(color.originalPalette, 1000)
    isPlaying = true
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    isPlaying = false
    explosion = sprites.create(assets.image`explosion`, SpriteKind.prompt)
    explosion.setPosition(mySprite.x, mySprite.y)
    sprites.destroy(otherSprite)
    sprites.destroy(sprite)
    animation.runImageAnimation(
    explosion,
    assets.animation`explosionAnim`,
    500,
    false
    )
    explosion.setVelocity(0, screenSpeed)
    whereItMoves = sprites.create(assets.image`whereItMoves`, SpriteKind.prompt)
    whereItMoves.setVelocity(0, screenSpeed)
    ambulance = sprites.createProjectileFromSide(assets.image`ambulance`, 0, 0)
    ambulance.setPosition(80, -7)
    whereItMoves.setPosition(explosion.x, explosion.y - 16)
    ambulance.follow(whereItMoves, screenSpeed + 10)
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    music.play(music.melodyPlayable(music.siren), music.PlaybackMode.InBackground)
    pause(2000)
    shop()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.extra, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    info.setScore(info.score() * 1.5)
})
function shop () {
    color.startFade(color.originalPalette, color.Black, 1000)
    pause(1000)
    myMenu3.close()
    scene.setBackgroundImage(assets.image`road`)
    music.stopAllSounds()
    pause(1000)
    sprites.destroy(mySprite)
    sprites.destroy(whereItMoves)
    sprites.destroy(explosion)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    pause(1000)
    shopTitle = sprites.create(assets.image`shop`, SpriteKind.prompt)
    shopTitle.y = 10
    color.startFadeFromCurrent(color.originalPalette, 1000)
    list()
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (shopTitle) {
        sprites.destroy(shopTitle)
    }
    if (myMenu3) {
        sprites.destroy(myMenu3)
    }
    menu()
})
sprites.onDestroyed(SpriteKind.Projectile, function (sprite) {
    info.changeScoreBy(carType)
})
let nextSpawnTime = 0
let p: Sprite = null
let clock: Sprite = null
let xPicker = 0
let ambulance: Sprite = null
let whereItMoves: Sprite = null
let explosion: Sprite = null
let shopTitle: Sprite = null
let everyHowMuch = 0
let carType = 0
let car: Image = null
let total = 0
let listOfCars: miniMenu.MenuItem[] = []
let myMenu3: miniMenu.MenuSprite = null
let myMenu2: miniMenu.MenuSprite = null
let isPlaying = false
let golfCart = ""
let America = ""
let pink = ""
let title: fancyText.TextSprite = null
let coin: Sprite = null
let mySprite: Sprite = null
let myMenu: miniMenu.MenuSprite = null
let maxCars = 0
let screenSpeed = 0
let titleScreen: Image = null
// 1. Initial State Variables
screenSpeed = 10
maxCars = 1
let carHeight = 15
let totalDistance = 120 + carHeight
game.setDialogCursor(assets.image`A`)
menu()
// Spawns Clocks
game.onUpdateInterval(randint(5000, 10000), function () {
    if (isPlaying) {
        xPicker = randint(1, 2)
        clock = sprites.create(assets.image`clock`, SpriteKind.delayer)
        if (xPicker == 1) {
            clock.setPosition(randint(6, 69), 0)
        } else if (xPicker == 2) {
            clock.setPosition(randint(91, 154), 0)
        }
        clock.setVelocity(0, screenSpeed + 10)
        clock.setFlag(SpriteFlag.AutoDestroy, true)
    }
})
// Spawns Coins
game.onUpdateInterval(randint(5000, 10000), function () {
    if (isPlaying) {
        xPicker = randint(1, 2)
        coin = sprites.create(assets.image`coin`, SpriteKind.extra)
        if (xPicker == 1) {
            coin.setPosition(randint(6, 69), 0)
        } else if (xPicker == 2) {
            coin.setPosition(randint(91, 154), 0)
        }
        coin.setVelocity(0, screenSpeed + 10)
        coin.setFlag(SpriteFlag.AutoDestroy, true)
    }
})
// 2. Continuous Spawning Algorithm (Uses Pause)
forever(function () {
    if (isPlaying) {
        p = sprites.create(assets.image`enemyCar`, SpriteKind.Projectile)
        xPicker = randint(1, 2)
        if (xPicker == 1) {
            p.setPosition(randint(6, 69), (0 - carHeight) / 2)
        } else if (xPicker == 2) {
            p.setPosition(randint(91, 154), (0 - carHeight) / 2)
        }
        p.setVelocity(0, screenSpeed + 20)
        p.setFlag(SpriteFlag.AutoDestroy, true)
        nextSpawnTime = totalDistance / p.vy / maxCars * 1000
        pause(nextSpawnTime)
    } else {
        // Small yield when not playing
        pause(100)
    }
})
// 3. Accelerate safely by 1 px every 100 ms
game.onUpdateInterval(100, function () {
    if (isPlaying) {
        screenSpeed += 1
        scroller.scrollBackgroundWithSpeed(0, screenSpeed)
        for (let spr of sprites.allOfKind(SpriteKind.Projectile)) {
            spr.vy = screenSpeed + 20
        }
    }
})
