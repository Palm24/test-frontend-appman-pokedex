# Test-Front-end-appman-pokedex
This repository for send test front-end position of appman

## คำอธิบายเบื้องต้น
This project is **\*React Project\*** เขียนอยู่ในรูปแบบ class component โดยการทำงานทั้งหมดจะอยู่ภายในไฟล์ `App.js` และกำหนด style ในไฟล์ `App.css` 

**Project** เป็น React version 16 โดยผมจะใช้ตัว Libraary ช่วยในเรื่องของ UI โดยการใช้ Material UI Version 5

### คำจำกัดความเนื้อหาใน Project เบื้องต้น
1. โดยเบื้องต้นจะเป็น Project ที่เกี่ยวกับ Pokemon คือการค้นหา เพิ่มและลบ card pokemon เข้ามาภายใน My Pokedex ของเรา
2. โดย Card Pokemon ทั้งหมดจะถูกแสดงอยู่ภายใน Modal Dialog
3. เราสามารถ Search ชื่อ card pokemon ที่เราต้องการได้
4. เราสามารถ Add card pokemon ที่เราต้องการเข้ามาใน My pokedex ของเราได้
5. หลังจากที่เรา Add card ที่เราต้องการแล้ว ภายใน Dialog การ์ดที่เราทำการ Add มาทั้งหมดนั้นจะหายไปจาก Dialog ถ้าทำการ Search ก็จะหาไม่เจอ เพราะเราได้ทำการ Add เข้ามาใน My pokedex แล้ว
6. จากนั้นกลับมาหน้า My pokedex ของเราจะแสดงรายการ card pokemon ที่เราทำการ Add เข้ามา
7. โดยเนื้อหาที่แสดงจะมี รูป card pokemon, Hp(เลือด), Strength(ความแข็งแกร่ง), Weakness(ความอ่อนแอ) และ Happiness(ค่าความสุข)
8. ภายใน My pokedex เราสามารถลบรายการ card ที่เราไม่ต้องการได้ โดยการคลิกไปที่ปุ่ม X(กากบาท) ตรงมุมขวาบนของ card จากนั้น card ใบนั้นจะหายไป
9. ถ้าต้องการเพิ่ม card ใหม่ ก็ทำการคลิกปุ่ม +(Add) ด้านล่างเพื่อเพิ่ม card ใหม่เข้ามาใน My pokedex

### คำอธิบายในการเริ่มต้นใช้งาน Project
1. Dowload Source code ใน `Github` ลงมาในเครื่อง
2. โดยใน `Github` คลิก `<> Code` เลือก Download ZIP
3. แตกไฟล์ ZIP
4. จากนั้นทำการเปิดตัว Project และส่วนหัวเมนูด้านบนเลือก Terminal จากนั้นเลือก New Terminal จะปรากฎ tab ใหม่มาด้านล่าง
5. จากนั้นใช้คำสั่ง `npm install` และรอจนกว่าจะ install เสร็จสิ้น
6. จากนั้นใช้คำสั่ง `npm start` เพื่อ run ตัว Project
7. จากนั้นทำการเปิด Terminal ใหม่ขึ้นมาอีก 1 Terminal และใช้คำสั่ง `npm run api` เพื่อ run service api
8. เสร็จสิ้นการ install และ run project

# Requirement from AppMan Pokédex (My Pokémon cards list)

## AppMan Pokédex (My Pokémon cards list)

We want you to build a web application with the following requirements:

| User Story | Acceptance Criteria |
|:---|:---|
|As a user, I want to see my Pokédex, so that I can build a list of Pokémon cards that I like.|- I can see the list of my Pokémon cards.<br>- I can add a Pokémon card to my Pokédex from search result list.<br>- I can remove a Pokémon card from my Pokédex.|
|As a user, I want to be able to search for a Pokémon card, so that I can add it into my Pokédex.|- I can search based on Pokémon name.<br>- I can search based on Pokémon type.|
|As a user, I want to see only unselected Pokémon cards on the search list, so that I can select a different Pokémon card.|- I can see only unselect Pokémon cards on the result list.|
|As a user, I want to cancel adding a Pokémon to my Pokédex, so that I can close the Pokémon list modal.|- I can close the Pokémon list modal by clicking outside.|
|As a user, I want to see the details of each Pokémon, so that I can see the abilities of a Pokémon.|- I can see HP level of a Pokémon.<br>- I can see Strength level of a Pokémon.<br>- I can see Weakness level of a Pokémon.<br>- I can see Happiness level of a Pokémon.|

## Limitation
- Good news!! Support only on iPad (1024x768) screen size :)) no RESPONSIVE!!

## Also, we already prepared some stuff for you!!! :D

### 1. Base project (includes iPad layout screen, so cool!!)

### 2. Service API
  - You can run service api by `yarn run api`
  - The endpoint to get Pokémon list is `[GET]http://localhost:3030/api/cards`
  - query
    - limit: default 20 item/
    - name: search monster by name
    - type: search monster by type
    - example: http://localhost:3030/api/cards?limit=30&name=picha&type=normal

### 3. How to calculate `HP level`, `Strength level`, `Weakness level` and `Happiness level`.

  - HP level calculation
      - maximum is 100. if value is higher than 100 set it to 100, otherwise 0.
  - Strength level calculation
      - use `attacks` length to multiply by 50, maximum is 100. e.g. if value is 1 set it to 50, 2 set it to 100, otherwise 0.
  - Weakness level calculation
      - use `weaknesses` length multiply by 100, maximum is 100. e.g. if value is 1 set it to 100, otherwise 0.
  - Damage calculation
      - use `damage` value without symbol of all attacks skill. e.g. 50+ set it to 50, 20* set it to 20, otherwise 0.
  - Happiness level calculation
      - ((HP / 10) + (Damage /10 ) + 10 - (Weakness)) / 5
      
  #### Example
    Pikachu {
      name: 'Pikachu',
      hp: 110,
      attacks: [
        { name: 'attack A', damage: '20+'},
        { name: 'attack B', damage: '40x'}
      ],
      weaknesses: [
        { name: 'weakness A'},
      ]
    }
  
    Output {
      hp: 100,
      strength: '100%',
      weakness: '50%',
      damage: 60,
      happiness: 5
    }
### 4. Interactive MockUp (as a .gif file)

![Pokédex MockUp](screenshot/exam-crop.gif)

### 5. Fonts (from Google Fonts)
  - `Atma:700`
  - `Gaegu`

### 6. Color codes

![Pokédex MockUp](screenshot/color-codes.png)

## How we score you??!!!
  - If you can complete all the requirements above, We surely score you 100!!!! NO reason!!
    - We will give you all the feedback later ;)
  - IF YOU FEEL LIKE SOMETHING IS MISSING, WE HAVE EXTRA SCORE FOR ANY ADDITIONAL THING YOU CAN PROVIDE. (Extra can be unit test, refactoring, performance tuning, etc. REMEMBER MAXIMUM IS NOT 100!!!)

If you have any questions, please do not hesitate to ask us anytime.
Wish you luck!! :)


