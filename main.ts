namespace SpriteKind {
    export const tile_detect = SpriteKind.create()
    export const hat = SpriteKind.create()
    export const neutral_enemy = SpriteKind.create()
    export const villager = SpriteKind.create()
    export const king = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    direction_facing = "up"
    mySprite.vy = -200
    animation.runImageAnimation(
    mySprite,
    assets.animation`jump`,
    100,
    false
    )
    if (sprites.allOfKind(SpriteKind.hat).length != 1) {
        fall_damage()
        pauseUntil(() => mySprite.isHittingTile(CollisionDirection.Bottom))
    }
})
function spawn_enemies () {
    for (let value of tiles.getTilesByType(assets.tile`bush enemy spawn`)) {
        myEnemy = sprites.create(assets.image`shrub`, SpriteKind.neutral_enemy)
        tiles.placeOnTile(myEnemy, value)
        myEnemy.ay = 500
        myEnemy.setFlag(SpriteFlag.GhostThroughWalls, false)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    projectile = sprites.create(assets.image`explosive`, SpriteKind.Projectile)
    projectile.setPosition(mySprite.x, mySprite.y)
    if (direction_facing == "right") {
        projectile.setVelocity(150, -50)
    } else if (direction_facing == "left") {
        projectile.setVelocity(-150, -50)
    } else {
        projectile.setVelocity(randint(-10, 10), -200)
    }
    projectile.ay = 500
    projectile.setFlag(SpriteFlag.GhostThroughWalls, false)
    animation.runImageAnimation(
    projectile,
    assets.animation`splode`,
    150,
    false
    )
    pause(800)
    if (mySprite.overlapsWith(projectile)) {
        info.changeLifeBy(-1)
        spawn()
    }
    pause(150)
    for (let value of [
    assets.tile`skyblock`,
    assets.tile`crate`,
    assets.tile`cheese`,
    assets.tile`cheese2`,
    assets.tile`skyblock_hot`,
    assets.tile`shrub`
    ]) {
        if (projectile.tileKindAt(TileDirection.Left, value)) {
            tiles.setTileAt(projectile.tilemapLocation().getNeighboringLocation(CollisionDirection.Left), assets.tile`transparency16`)
            tiles.setWallAt(projectile.tilemapLocation().getNeighboringLocation(CollisionDirection.Left), false)
        }
        if (projectile.tileKindAt(TileDirection.Top, value)) {
            tiles.setTileAt(projectile.tilemapLocation().getNeighboringLocation(CollisionDirection.Top), assets.tile`transparency16`)
            tiles.setWallAt(projectile.tilemapLocation().getNeighboringLocation(CollisionDirection.Top), false)
        }
        if (projectile.tileKindAt(TileDirection.Right, value)) {
            tiles.setTileAt(projectile.tilemapLocation().getNeighboringLocation(CollisionDirection.Right), assets.tile`transparency16`)
            tiles.setWallAt(projectile.tilemapLocation().getNeighboringLocation(CollisionDirection.Right), false)
        }
        if (projectile.tileKindAt(TileDirection.Bottom, value)) {
            tiles.setTileAt(projectile.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), assets.tile`transparency16`)
            tiles.setWallAt(projectile.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), false)
        }
    }
    sprites.destroy(projectile)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`door0`, function (sprite, location) {
    tiles.setCurrentTilemap(store_tilemap)
    sprites.destroyAllSpritesOfKind(SpriteKind.neutral_enemy)
    spawn()
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`table`, function (sprite, location) {
    if (check_lore) {
        check_lore = false
        if (game.ask("do you want to read the book?")) {
            game.showLongText("published in 2048, after the globabl freeze", DialogLayout.Bottom)
            game.showLongText("THE PAST  by the legendary sheep", DialogLayout.Bottom)
            game.showLongText("In an era, long ago, there was just a basic jungle", DialogLayout.Bottom)
            game.showLongText("everyone in it was happy and warm, but some could not live there", DialogLayout.Bottom)
            game.showLongText("because of the temperature, they lived in the mountais", DialogLayout.Bottom)
            game.showLongText("this probably included you, dear reader. ", DialogLayout.Bottom)
            game.showLongText("of course at some point, the world froze over.", DialogLayout.Bottom)
            game.showLongText("for the former residents of this world, they could not find any place where they could merely survivve", DialogLayout.Bottom)
            game.showLongText("and so, because of that, the mountain people flourished.", DialogLayout.Bottom)
            game.showLongText("but according to legend, there is a warmer dimension", DialogLayout.Bottom)
            game.showLongText("they just need to find it", DialogLayout.Bottom)
            game.showLongText("you, dear reader, probably need to help them though..", DialogLayout.Bottom)
            game.showLongText("the portal is blue and swirly, but that's all I know", DialogLayout.Bottom)
            game.showLongText("I have heard that you can build one though..", DialogLayout.Bottom)
            pause(200)
            game.splash("You feel like you have a purpose now", "go fulfill your quest")
            pause(200)
            portals = true
            game.splash("portals are now active")
        }
        if (mySprite.tilemapLocation().column < location.column) {
            mySprite.x += -12
        } else {
            mySprite.x += 12
        }
        check_lore = true
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tiles.getTileAtLocation(tiles.locationInDirection(tiles.locationOfSprite(mySprite), CollisionDirection.Bottom)) == assets.tile`transparency16`) {
        tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(mySprite), CollisionDirection.Bottom), true)
        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(mySprite), CollisionDirection.Bottom), assets.tile`crate`)
    }
})
controller.combos.attachCombo("up up down down left right left right b a", function () {
    sprites.destroyAllSpritesOfKind(SpriteKind.hat)
    propellor_hat = sprites.create(assets.image`propellor hat`, SpriteKind.hat)
    propellor_hat.setFlag(SpriteFlag.GhostThroughWalls, true)
    propellor_hat.follow(mySprite, 300)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    direction_facing = "left"
    animation.runImageAnimation(
    mySprite,
    assets.animation`walk left`,
    150,
    true
    )
    fall_damage()
    pauseUntil(() => !(controller.left.isPressed()))
    animation.stopAnimation(animation.AnimationTypes.All, mySprite)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`portal`, function (sprite, location) {
    mySprite.setPosition(0, 0)
    while (mySprite.x == 0) {
        mySprite.x += 1
        sprites.destroyAllSpritesOfKind(SpriteKind.neutral_enemy)
        if (!(alt_music)) {
            scene.setBackgroundImage(assets.image`lost in space`)
            mySprite.ay = -300
            color.startFadeFromCurrent(color.DIY)
            tiles.setCurrentTilemap(tilemaps[info.score() % tilemaps.length])
            alt_music = true
            spawn()
            game.splash("HOW DID YOU GET HERE?!", "anyways, this is the alternate reality")
            game.splash("it's hot here..")
            game.splash("wait.. is this the dimension the book mentioned?")
        } else {
            scene.setBackgroundImage(assets.image`background`)
            mySprite.ay = -500
            color.startFadeFromCurrent(color.originalPalette)
            tiles.setCurrentTilemap(tilemaps[info.score() % tilemaps.length])
            alt_music = false
            spawn()
            game.splash("A WAY BACK?!", "Why did that dimension feel faster?")
        }
    }
})
info.onScore(100, function () {
    game.gameOver(true)
})
sprites.onOverlap(SpriteKind.neutral_enemy, SpriteKind.Projectile, function (sprite, otherSprite) {
    sprite.setBounceOnWall(true)
    sprite.fy += 100
    sprite.vx += 50
    anger = true
    pause(5000)
    sprite.setBounceOnWall(false)
    sprite.fy += -100
    sprite.vx += -50
    anger = false
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`health`, function (sprite, location) {
    info.changeLifeBy(1)
    tiles.setTileAt(location, assets.tile`transparency16`)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.villager, function (sprite, otherSprite) {
    otherSprite.setKind(SpriteKind.tile_detect)
    if (!(alt_music)) {
        game.showLongText([
        "how are you doing, princess from the cold realm?",
        "Found a portal yet? it's getting cold, FAST!",
        "brr...",
        "it's warmer here than anywhere else, but still cold",
        "hi. wait, you're going to find us a warmer dimension? COOL!",
        "what took you so long? it's still freezing, but maybe that book will help.."
        ]._pickRandom(), DialogLayout.Bottom)
    } else {
        game.showLongText([
        "how are you doing, princess from the cold realm?",
        "it's nice here",
        "coming back here soon enough? oh right, it's too warm here for you.",
        "nice and toasty",
        "funally, you found it!",
        "i guess that book really did help! "
        ]._pickRandom(), DialogLayout.Bottom)
    }
    pause(5000)
    otherSprite.setKind(SpriteKind.villager)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    direction_facing = "right"
    animation.runImageAnimation(
    mySprite,
    assets.animation`walk right`,
    150,
    true
    )
    fall_damage()
    pauseUntil(() => !(controller.right.isPressed()))
    animation.stopAnimation(animation.AnimationTypes.All, mySprite)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`door`, function (sprite, location) {
    sprites.destroyAllSpritesOfKind(SpriteKind.neutral_enemy)
    tilemaps = [
    tilemap`level0`,
    tilemap`level7`,
    tilemap`level 5`,
    tilemap`level2`,
    tilemap`level 3`,
    tilemap`level3`
    ]
    store_tilemap = tilemaps[info.score() % tilemaps.length]
    moon = true
    tiles.setCurrentTilemap(tilemap`bonus_rooms`)
    tiles.placeOnTile(mySprite, tiles.getTilesByType(assets.tile`door0`)[info.score() % tiles.getTilesByType(assets.tile`door0`).length].getNeighboringLocation(CollisionDirection.Right))
    mySprite.x += 8
    if (!(portals)) {
        for (let value of tiles.getTilesByType(assets.tile`portal`)) {
            tiles.setTileAt(value, assets.tile`portal`)
        }
    }
    spawn_enemies()
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`cloud`)) {
        cloud = mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom)
        tiles.setWallAt(cloud, false)
        pauseUntil(() => mySprite.tileKindAt(TileDirection.Top, assets.tile`cloud`))
        tiles.setWallAt(cloud, true)
    }
})
function spawn () {
    sprites.destroyAllSpritesOfKind(SpriteKind.tile_detect)
    tiles.setTileAt(tiles.getTileLocation(0, 0), assets.tile`poison_pit_open`)
    tiles.setTileAt(tiles.getTileLocation(2, 0), assets.tile`portal`)
    tiles.setTileAt(tiles.getTileLocation(3, 0), assets.tile`lava_custom`)
    mySprite.ay = 500
    info.changeLifeBy(1)
    controller.moveSprite(mySprite, 100, 0)
    check = true
    check_lore = true
    fall_check = true
    scene.cameraFollowSprite(mySprite)
    tiles.placeOnRandomTile(mySprite, assets.tile`bed`)
    spawn_enemies()
    if (alt_music) {
        for (let value of tiles.getTilesByType(assets.tile`skyblock`)) {
            tiles.setTileAt(value, assets.tile`skyblock_hot`)
        }
    }
    if (!(portals)) {
        for (let value of tiles.getTilesByType(assets.tile`portal`)) {
            tiles.setTileAt(value, assets.tile`portal`)
        }
    }
}
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    sprite.fx = 20
})
function fall_damage () {
    if (fall_check && !(mySprite.isHittingTile(CollisionDirection.Bottom))) {
        row_start = mySprite.y
        fall_check = false
        pauseUntil(() => mySprite.isHittingTile(CollisionDirection.Bottom))
        if (row_start + 48 < mySprite.y && !(tiles.tileAtLocationEquals(mySprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Left), assets.tile`bed`) || tiles.tileAtLocationEquals(mySprite.tilemapLocation(), assets.tile`bed`))) {
            console.log(row_start + 48 - mySprite.y / 16)
            if (tiles.tileAtLocationEquals(mySprite.tilemapLocation(), assets.tile`water`)) {
                splash = sprites.create(assets.image`splash`, SpriteKind.tile_detect)
                splash.setPosition(mySprite.x, mySprite.y)
                animation.runImageAnimation(
                splash,
                assets.animation`splash anim`,
                100,
                false
                )
                pause(1000)
                sprites.destroy(splash)
            } else {
                info.changeLifeBy(-1)
            }
            fall_check = true
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.king, function (sprite, otherSprite) {
    otherSprite.setKind(SpriteKind.tile_detect)
    if (true) {
        game.showLongText("cool. just use that table over there to make one, so we can finally get out of here", DialogLayout.Bottom)
    } else {
        game.showLongText("I bet you can. just use that table over there to make one, so we can finally get out of here", DialogLayout.Bottom)
    }
    build_portal = true
    pause(5000)
    otherSprite.setKind(SpriteKind.king)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`gold crate`, function (sprite, location) {
    info.changeScoreBy(1)
    tilemaps = [
    tilemap`level0`,
    tilemap`level7`,
    tilemap`level 5`,
    tilemap`level2`,
    tilemap`level 3`,
    tilemap`level3`,
    tilemap`village`
    ]
    console.log(info.score() % tilemaps.length)
    if (portals && !(alt_music)) {
        if (info.score() % tilemaps.length == 6) {
            tiles.setCurrentTilemap(tilemap`village`)
            for (let value of tiles.getTilesByType(assets.tile`villager spawner`)) {
                villager = sprites.create([assets.image`villager_w_left`, assets.image`villager_stand`, assets.image`villager_w_r`]._pickRandom(), SpriteKind.villager)
                villager.image.replace(2, [
                3,
                4,
                5,
                6,
                7,
                9,
                10,
                11
                ]._pickRandom())
                tiles.placeOnTile(villager, value)
                villager.setFlag(SpriteFlag.GhostThroughWalls, false)
                villager.ay = 500
                tiles.setTileAt(value, assets.tile`transparency16`)
            }
            king = sprites.create(assets.image`king`, SpriteKind.king)
            king.setFlag(SpriteFlag.GhostThroughWalls, false)
            tiles.placeOnTile(king, tiles.getTilesByType(assets.tile`king`)[0])
            tiles.setTileAt(tiles.getTilesByType(assets.tile`king`)[0], assets.tile`transparency16`)
        }
    } else {
        tilemaps.pop()
        tiles.setCurrentTilemap(tilemaps[info.score() % tilemaps.length])
    }
    sprites.destroyAllSpritesOfKind(SpriteKind.neutral_enemy)
    spawn()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.neutral_enemy, function (sprite, otherSprite) {
    if (otherSprite.y > sprite.y + 4 && 0 < mySprite.vy) {
        sprites.destroy(otherSprite, effects.fountain, 500)
    }
    if (anger) {
        info.changeLifeBy(-1)
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`rocket`, function (sprite, location) {
    sprites.destroyAllSpritesOfKind(SpriteKind.neutral_enemy)
    spawn_enemies()
    if (moon) {
        tiles.setCurrentTilemap(tilemap`moon_1`)
        scene.setBackgroundImage(assets.image`lost in space`)
        moon = false
        tiles.placeOnTile(mySprite, tiles.getTilesByType(assets.tile`rocket`)[0].getNeighboringLocation(CollisionDirection.Right))
    } else {
        scene.setBackgroundImage(assets.image`background`)
        tiles.setCurrentTilemap(tilemap`bonus_rooms`)
        moon = true
        tiles.placeOnTile(mySprite, tiles.getTilesByType(assets.tile`rocket`)[0].getNeighboringLocation(CollisionDirection.Left))
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`coin`, function (sprite, location) {
    tiles.setTileAt(location, assets.tile`transparency16`)
    info.changeScoreBy(1)
})
let burn_crate: tiles.Location = null
let trail: Sprite = null
let king: Sprite = null
let villager: Sprite = null
let build_portal = false
let splash: Sprite = null
let row_start = 0
let fall_check = false
let check = false
let cloud: tiles.Location = null
let moon = false
let anger = false
let tilemaps: tiles.TileMapData[] = []
let alt_music = false
let propellor_hat: Sprite = null
let check_lore = false
let store_tilemap: tiles.TileMapData = null
let projectile: Sprite = null
let myEnemy: Sprite = null
let direction_facing = ""
let portals = false
let mySprite: Sprite = null
tiles.setTilemap(tilemap`level0`)
info.setLife(4)
mySprite = sprites.create(assets.image`stand`, SpriteKind.Player)
mySprite.ay = 500
scene.setBackgroundImage(assets.image`background`)
portals = false
spawn()
game.onUpdateInterval(25, function () {
    trail = sprites.create(assets.image`trail`, SpriteKind.Player)
    trail.lifespan = 500
    trail.setPosition(mySprite.x, mySprite.y)
    trail.z += -255
    if (Math.percentChance(20)) {
        burn_crate = tiles.locationInDirection(tiles.getTilesByType(assets.tile`lava_custom`)._pickRandom(), CollisionDirection.Top)
        if (tiles.tileAtLocationEquals(burn_crate, assets.tile`crate`)) {
            tiles.setTileAt(burn_crate, assets.tile`flaming crate`)
            pause(400)
            tiles.setTileAt(burn_crate, assets.tile`transparency16`)
            tiles.setWallAt(burn_crate, false)
        }
    }
    for (let index = 0; index <= 3; index++) {
        if (mySprite.tileKindAt(TileDirection.Center, [
        assets.tile`poison_damage`,
        assets.tile`lava_detection`,
        assets.tile`spike`,
        assets.tile`spike_flipped`
        ][index])) {
            info.changeLifeBy(-2)
            spawn()
        }
    }
    if (mySprite.tileKindAt(TileDirection.Center, assets.tile`build portal`)) {
        mySprite.x += -16
        if (build_portal) {
            game.splash("press A to build a portal")
            if (controller.A.isPressed()) {
                tiles.setTileAt(tiles.getTilesByType(assets.tile`portal`)[0], assets.tile`portal`)
            }
        } else {
            game.splash("you don't understand what this is for")
        }
    }
})
forever(function () {
    for (let index = 0; index < 2; index++) {
        music.play(music.stringPlayable("G A B A D D D F ", 200), music.PlaybackMode.UntilDone)
    }
    for (let index = 0; index < 2; index++) {
        music.play(music.stringPlayable("G A B A C C C F ", 200), music.PlaybackMode.UntilDone)
    }
    for (let index = 0; index < 2; index++) {
        music.play(music.stringPlayable("A B C5 B E E E G ", 200), music.PlaybackMode.UntilDone)
    }
    for (let index = 0; index < 2; index++) {
        music.play(music.stringPlayable("A B C5 B D D D G ", 200), music.PlaybackMode.UntilDone)
    }
})
