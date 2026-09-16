export const dishes = () =>{
    const lactoseFoods = [
    "Zabkása tejjel", 
    "Görög joghurt tál", 
    "Túrós lepény", 
    "Fűszeres túrókrém zöldségekkel"];

    const glutenFoods = [
    "Avokádós teljes kiörlésű pirítós", 
    "Sutőben rántott csirke rizzsel", 
    "Cézár saláta"];

    const fishFoods = [
        "Lazac rizzsel", 
        "Tonhalsalláta", 
        "Garnélás avokádó saláta", 
        "Tojáslepény tonhallal", 
        "Párolt tőkehal salátával", 
        "Sült lazacfilé spárgával"];

    const eggFoods = [
        "Zöldséges omlett", 
        "Tojás rántotta", 
        "Tükör tojás", 
        "Fehérjés palacsinta", 
        "Cézár saláta", 
        "Tojáslepény tonhallal"];

    const breakfasts = ["Zabkása", "Zöldséges omlett", "Smoothie", "Tojás rántotta", "Zabkása tejjel", "Zabkása növényi tejjel",
                        "Tükör tojás", "Zabkása fehérjeporral", "Avokádós teljes kiörlésű pirítós", "Túrós lepény","Görög joghurt tál",
                        "Fehérjés palacsinta"];
    const lunches = ["Csirkemell rizzsel", "Pulyka bulgurral", "Marhahús krumplival", "Lazac rizzsel","Cézár saláta","Tonhalsalláta",
                    "Kinoás csirketál","Marhahúsos saláta","Garnélás avokádó saláta","Grillezett tofu steak", "Grillezett csirkemell édesburgonyával",
                 "Mustáros marhaszelet", "Sutőben rántott csirke rizzsel", "Bárányborda édesburgonyával"];
    const dinners = ["Sült zöldségtál", "Saláta csirkével", "Fűszeres túrókrém zöldségekkel", "Saláta tál","Tojáslepény tonhallal", 
        "Párolt tőkehal salátával","Sült lazacfilé spárgával","Hirtelen sült csirkemáj zöldségekkel"];
    
    const foods ={"Zabkása" :100 , "Zöldséges omlett" :223 , "Smoothie":54 , "Tojás rántotta":180 , "Zabkása tejjel":120 , "Zabkása növényi tejjel":100 ,
                "Tükör tojás":190 , "Zabkása fehérjeporral":100 , "Avokádós teljes kiörlésű pirítós":210 , "Túrós lepény":220 ,"Görög joghurt tál":120 ,
                "Fehérjés palacsinta":180 ,"Csirkemell rizzsel":150 , "Pulyka bulgurral":140 , "Marhahús krumplival":185 , "Lazac rizzsel":210 ,"Cézár saláta":200 ,
                "Tonhalsalláta":150 ,"Kinoás csirketál":170 ,"Marhahúsos saláta":170 ,"Garnélás avokádó saláta":190 ,"Grillezett tofu steak":150 ,
                "Grillezett csirkemell édesburgonyával":155 ,"Mustáros marhaszelet":190 , "Sutőben rántott csirke rizzsel":215 , "Bárányborda édesburgonyával":260 ,
                "Sült zöldségtál":110 , "Saláta csirkével":140 ,"Fűszeres túrókrém zöldségekkel":120 , "Saláta tál":85 ,"Tojáslepény tonhallal":170 ,
                "Párolt tőkehal salátával":115 ,"Sült lazacfilé spárgával":210 ,"Hirtelen sült csirkemáj zöldségekkel":170 };

    return {foodGroups: {lactoseFoods,glutenFoods,fishFoods,eggFoods},breakfasts,lunches,dinners,foods};
}