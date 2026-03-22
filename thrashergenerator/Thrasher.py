from random import randint

Skater=["G.T.", "T-Funk", "Ishod", "The Boss", "AVE", "Silas", "Mason", "Big Boy Foy", "Nyjah", "P-Rod", "Cyrus", "Wes Kramer",
        "Louie Lopez", "Tyshawn", "Lizzie", "Nora", "Austyn", "Kader", "Manderson", "Maite", "Evan Smith", "K-Walks", "BA",
        "Figgy", "Tom Knox", "Rayssa", "Joslin", "Chris Milic", "Marbie", "One of the McClung brothers", "Gabbers", "T-Puds"]
Crew=["Shep Dogs", "Supreme team", "local DIY", "BustCrew", "Workshop", "Skate Like A Girl nonprofit", "Sk8Mafia hemmies",
      "Atlas Skateshop", "Creech crew", "CPH", "Hell Ride crew", "Sabotage posse", "Theories of Atlantis camp",
      "Illegal Civ clique", "Am Scramblers", "Camp Woodward"]
Brand=["Indy","The 1-8","FA and Hockey","Santa Cruz", "HUF", "Emerica", "Primitive", "Habitat", "DGK", "Miles Grip", "Adidas",
       "MOB", "Baker Boys", "Krooked", "OJ Wheels", "Spitfire", "Nike SB", "Bones Wheels", "Toy Machine", "Ace Trucks", "Vans"]
Filmer=["GX1000", "Strobeck", "French Fred", "Ryan Lee", "the master lensman at "+(Brand[randint(0,len(Brand)-1)]), "Jacob Harris & Atlantic Drift",
        "Don Luong", "Davonte Jolly", "Naquan Rollings", "BeagleOneism", "Bobaj", "Wheatley"]
adjective=["gnarly", "wild", "high stakes", "unforgettable", "laid back", "all time", "heavy", "ungodly", "illmatic", "mind blowing",
           "otherworldly", "face melting", "killer", "artful"]
adjective2=["gnarly", "wild", "crazy", "unforgettable", "nonchalant", "friendly", "heavy", "chill", "god-tier", "top tier", "mind blowing"] #for people
dudes=["homies", "folks", "dudes", "maniacs", "rippers", "chillers", "pals"]
verb=["skates hard", "sends it", "shreds", "gets buck", "gets gnarly", "takes it to a new level", "gets fearless", "hits the road",
      "comes through", "holds it down", "hypes the crew", "defies death"]
verbpl=["get it on", "hit the steets", "get stoked", "get creative", "go for it", "get some NBDs", "flow", "roll", "make it fresh",
        "go for broke"]
Spot=["over at Tony's Ramp", "in the ditches", "at the Mega", "on some East Coast Crust", "in downtown LA", "down in Brazil",
      "at Burnside", "in the streets of Barcelona", "at a secret spot", "on the rails behind SawCon", "at Double Rock", "while over in China",
      "down the hills of SF", "at South Bank", "in the streets of NYC", "at Pulaski", "at Tampa Pro", "in The Bay", "in LA and NYC"]
video=["edit", "cut", "video", "vid", "compilation", "instagram compilation", "video", "edit", "video", "part"]
Washedup=["Tom Penny", "Dressen", "Hosoi", "Cardiel", "Frank", "Uncle Freddy", "Mike Carroll", "the man himself", "The Chief", "Cobra Cole",
          "Billy Marks", "Gary from Skateline", "a former SOTY", "BobGnar", "Arto", "Ray Barbee", "Karl Watson", "The Gonz", "Antwuan",
          "The Muska", "a legend", "Mike V", "Duffman", "Elissa"]
Trick=["SSBSTS", "heelflip", "switch trick", "noseblunt", "drop-in", "huge gap", "triple kink", "hill bomb", "noseblunt", "manual combo", "no-comply"]
stoke=["stoked", "hyped", "hyped to skate", "excited", "despressed", "in a state of euphoria", "stoked", "dazed and confused"]
simile=["a bat out of hell", "a flaming meteor", "a possessed pyscho", "no one else", "we've never seen", "an undead zombie",
        "an eagle", "a rabid dog"]
contest=["Red Bull contest", "the big game of S.K.A.T.E.", "Lower Bobs Summit", "Street League", "Olympic Qualifyers", "Bust or Bail summit",
         "X-Games", "Burnside Halloween Jam"]
sellout=["Mountain Dew", "McDonald's McRib Sandwich", "Uber Eats", "Butterfinger", "Red Bull", "Adidas", "Monster Energy", "Cariuma"]
struggle=["depression", "drugs", "alcohol", "motivation", "recent knee surgery", "the death of a good friend", "anxiety",
          "anger management", "going to prison", "owing tons of money in back taxes"]
Phrase=["Still watchin'.", "Get some!", "It's on!", "Awwww yeah!", "As seen in the latest issue of Thrasher magazine.", "P-Stone forever!",
        "This one'll get you hyped to skate.", "Beast mode engaged.", "Bring it don't sing it.", "Damn...", "Big ups.",
        "Welcome to the next level.", "All killer, no filler."]
year=["199", "200", "201"]

def Desc1():
    description = (Skater[randint(0,len(Skater)-1)]+" "+verb[randint(0,len(verb)-1)]+" "+Spot[randint(0,len(Spot)-1)]+" for "+Brand[randint(0,len(Brand)-1)]+". Just wait until you see the "+Trick[randint(0,len(Trick)-1)]+" ender. "+Phrase[randint(0,len(Phrase)-1)])
    print(description)
    return description

def Desc2():
    description = (Skater[randint(0,len(Skater)-1)]+" "+verb[randint(0,len(verb)-1)]+" "+Spot[randint(0,len(Spot)-1)]+" for "+Brand[randint(0,len(Brand)-1)]+". This "+video[randint(0,len(video)-1)]+" is "+adjective[randint(0,len(adjective)-1)]+".")
    print(description)
    return description

def Desc3():
    description = (Skater[randint(0,len(Skater)-1)]+" and "+Skater[randint(0,len(Skater)-1)]+" "+verbpl[randint(0,len(verbpl)-1)]+" with the "+dudes[randint(0,len(dudes)-1)]+" from the "+Crew[randint(0,len(Crew)-1)]+" in this ")+adjective[randint(0,len(adjective)-1)]+" "+video[randint(0,len(video)-1)]+" by "+Filmer[randint(0,len(Filmer)-1)]+"."
    print(description)
    return description

def Desc4():
    description = ("The "+dudes[randint(0,len(dudes)-1)]+" from "+Brand[randint(0,len(Brand)-1)]+" "+verbpl[randint(0,len(verbpl)-1)]+" "+Spot[randint(0,len(Spot)-1)]+". Look for a special appearance from "+Washedup[randint(0,len(Washedup)-1)])+"."
    print(description)
    return description

def Desc5():
    description = (Brand[randint(0,len(Brand)-1)]+" honors "+Washedup[randint(0,len(Washedup)-1)])+" in this "+adjective[randint(0,len(adjective)-1)]+" video featuring "+Skater[randint(0,len(Skater)-1)]+", "+Skater[randint(0,len(Skater)-1)]+", and "+Skater[randint(0,len(Skater)-1)]+"."
    print(description)
    return description

def Desc6():
    description = (Phrase[randint(0,len(Phrase)-1)]+" "+Skater[randint(0,len(Skater)-1)])+", "+Skater[randint(0,len(Skater)-1)]+", "+Skater[randint(0,len(Skater)-1)]+", "+Skater[randint(0,len(Skater)-1)]+", and a bunch of other "+adjective2[randint(0,len(adjective2)-1)]+" "+dudes[randint(0,len(dudes)-1)]+" "+verbpl[randint(0,len(verbpl)-1)]+" "+Spot[randint(0,len(Spot)-1)]+"."
    print(description)
    return description

def Desc7():
    description = (Skater[randint(0,len(Skater)-1)])+" teams up with "+Filmer[randint(0,len(Filmer)-1)]+" to "+verbpl[randint(0,len(verbpl)-1)]+" "+Spot[randint(0,len(Spot)-1)]+" for a new video by "+Brand[randint(0,len(Brand)-1)]+". The "+Trick[randint(0,len(Trick)-1)]+" game in this one is "+adjective[randint(0,len(adjective)-1)]+"."
    print(description)
    return description

def Desc8():
    description = "Check out the "+adjective[randint(0,len(adjective)-1)]+" Rough Cut of "+Skater[randint(0,len(Skater)-1)]+" from the recent "+Brand[randint(0,len(Brand)-1)]+" "+video[randint(0,len(video)-1)]+". That last "+Trick[randint(0,len(Trick)-1)]+" is sure to get you "+stoke[randint(0,len(stoke)-1)]+"."
    print(description)
    return description

def Desc9():
    description = (Skater[randint(0,len(Skater)-1)])+" introduces "+Washedup[randint(0,len(Washedup)-1)]+"'s "+adjective[randint(0,len(adjective)-1)]+" "+year[randint(0,len(year)-1)]+str((randint(0,8)+1))+" part for "+Brand[randint(0,len(Brand)-1)]+" in the latest installment of Thrasher Classics. That "+Trick[randint(0,len(Trick)-1)]+" still has us "+stoke[randint(0,len(stoke)-1)]+" years later."
    print(description)
    return description

def Desc10():
    description = (Skater[randint(0,len(Skater)-1)])+" "+verb[randint(0,len(verb)-1)]+" like "+simile[randint(0,len(simile)-1)]+". Then, after a few "+adjective[randint(0,len(adjective)-1)]+" tricks from the "+Crew[randint(0,len(Crew)-1)]+", "+Skater[randint(0,len(Skater)-1)]+" shuts it down with a "+Trick[randint(0,len(Trick)-1)]+" you have to see to believe."
    print(description)
    return description

def Desc11():
    description = "Everyone got "+adjective2[randint(0,len(adjective2)-1)]+" at the recent "+contest[randint(0,len(contest)-1)]+" "+Spot[randint(0,len(Spot)-1)]+": "+Skater[randint(0,len(Skater)-1)]+", "+Skater[randint(0,len(Skater)-1)]+", "+Skater[randint(0,len(Skater)-1)]+"... even "+Washedup[randint(0,len(Washedup)-1)]+" got some! This recap "+video[randint(0,len(video)-1)]+" is brought to you by "+sellout[randint(0,len(sellout)-1)]+"."
    print(description)
    return description

def Desc12():
    description = "In a special interview brought to you by "+sellout[randint(0,len(sellout)-1)]+", "+Skater[randint(0,len(Skater)-1)]+" talks openly about having "+adjective[randint(0,len(adjective)-1)]+" struggles with "+struggle[randint(0,len(struggle)-1)]+". You'll hear how an unexpected visit from "+Washedup[randint(0,len(Washedup)-1)]+" provided the motivation to turn it around."
    print(description)
    return description

def Desc13():
    description = "
    "+Brand[randint(0,len(Brand)-1)]+" gets "+Skater[randint(0,len(Skater)-1)]+" on the 
    session with "+Skater[randint(0,len(Skater)-1)]+" and "+Skater[randint(0,len(Skater)-1)]+" in his first edit as a team rider."
    print(description)
    return description

def Desc14():
    description = "
    "+Skater[randint(0,len(Skater)-1)]+" stops by "+contest[randint(0,len(contest)-1)]+" and gives
    away some of his signature "+Brand[randint(0,len(Brand)-1)]+"s in the process."
    print(description)
    return description

number=randint(0,12)

if number == 0:
    Desc1()
if number == 1:
    Desc2()
if number == 2:
    Desc3()
if number == 3:
    Desc4()
if number == 4:
    Desc5()
if number == 5:
    Desc6()
if number == 6:
    Desc7()
if number == 7:
    Desc8()
if number == 8:
    Desc9()
if number == 9:
    Desc10()
if number == 10:
    Desc11()
if number == 11:
    Desc12()
if number == 12:
    Desc13()   
if number == 13:
    Desc14()   

print()
#Desc1()
#Desc2()
#Desc3()
#Desc4()
#Desc5()
#Desc6()
#Desc7()
#Desc8()
#Desc9()
#Desc10()
#Desc11()
#Desc12()
#Desc13()
#Desc14()
 