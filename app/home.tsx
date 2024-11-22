'use client';
import { generateRecipe } from "@/lib/ai";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useTheme } from "next-themes";


import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMediaQuery } from '@custom-react-hooks/use-media-query'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import Markdown from 'react-markdown'
import { Select, SelectContent, SelectValue, SelectTrigger, SelectLabel, SelectGroup, SelectItem } from "@/components/ui/select";
import { jsPDF } from "jspdf"; // Import jsPDF

interface MyChoice{
  mode:'Fitness' | 'Vegan' | 'Normal',
  allergies?:string[] | string,
  ingredients?:string[] | string,
  diet?:string[] | string,
}

interface Message{
  role:'user' | 'assistant',
  content:string,
}




export function Chat() {
  const [choice,setChoice] = useState<MyChoice>({mode:'Normal'});
  const handleChoice = (newChoice:MyChoice) => {
    setChoice(newChoice);
  }
  async function getRecipe(choice:MyChoice ,userPrompt:string){
    let prompt = userPrompt;
    if (Object.values(choice).some((pref) => pref.length > 0)) {
        if(choice.allergies) prompt += `\n\nAvoid the following allergens: ${choice.allergies}`;
        if(choice.ingredients) prompt += `\n\nUse the following ingredients: ${choice.ingredients}`;
        if(choice.diet) prompt += `\n\nFollow the following diet: ${choice.diet}`;
    }
    const recipe = await generateRecipe(prompt,choice.mode);
    return recipe;
  }
  return <Home recipe={getRecipe} choice={choice} handleChoice={handleChoice} />
}


export function Home({recipe,choice,handleChoice}:{recipe:(choice:MyChoice,userPrompt:string)=>Promise<string>,choice:MyChoice,handleChoice:(newChoice:MyChoice)=>void}){
  function isRecipeMessage(message: string): boolean {
    const recipeKeywords = [
      'recipe', 'ingredients', 'instructions', 'cooking', 
      'preparation', 'method', 'steps', 'bake', 'cook', 
      'roast', 'grill', 'fry', 'simmer', 'boil', 'saute', 
      'steam', 'broil', 'blend', 'chop', 'dice', 'mix', 
      'whisk', 'stir', 'marinate', 'season', 'garnish', 
      'peel', 'slice', 'measure', 'knead', 'serve', 
      'plating', 'dish', 'meal', 'snack', 'appetizer', 
      'dessert', 'entree', 'main course', 'side dish', 
      'baking', 'cuisine', 'flavor', 'taste', 'portion', 
      'temperature', 'oven', 'skillet', 'pan', 'microwave', 
      'pressure cooker', 'instant pot', 'slow cooker', 
      'stove', 'griddle', 'spices', 'herbs', 'sauce', 
      'dressing', 'rub', 'glaze', 'batter', 'dough', 
      'topping', 'crumbs', 'pastry', 'filling', 'stuffing'
    ];
    return recipeKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    ) || message.toLowerCase().includes('download');
  }

  const [messages,setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading,setIsLoading] = useState(false);
  const [canExportPDF, setCanExportPDF] = useState(false);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const formSchema = z.object({
    prompt: z.string().min(1, "Message is required"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  async function onSubmit(values:z.infer<typeof formSchema>){
    setIsLoading(true);
    try{
      setMessages((prev) => [...prev,{role:'user',content:values.prompt}]);
      await new Promise(resolve => setTimeout(resolve, 500));
      const myRecipe = await recipe(choice,values.prompt);
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages((prev) => prev.slice(0, -1).concat([...prev,{role:'assistant',content:myRecipe}]));
      form.reset();
      setIsLoading(false);
    }catch(error){
      setMessages((prev) => [...prev,{role:'assistant',content:'An error occurred while generating the recipe.'}]);
      form.reset();
      setIsLoading(false);
      throw error;
    }
  }
 
  return <>
  <header className="p-5 sticky top-0 bg-background z-10">
    <nav className="flex justify-between">
      <Link href="/">Home</Link>
      <ChoiceForm choice={choice} handleChoice={handleChoice} />
    </nav>
  </header>
  <section className="h-[calc(100dvh)] pt-4">
   <div className="h-full w-full flex flex-col">
   <ScrollArea className="h-full w-full">
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message,index) => (
        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
          <div className={`max-w-[75%] rounded-lg px-3 py-3 text-sm ${
            message.role === 'user' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}>
            <span className="break-words"><Markdown>{message.content}</Markdown></span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
   </ScrollArea>
   <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background gap-2 p-4 m-4 border rounded-lg space-y-2">
      <FormField control={form.control} name="prompt" render={({field}) => <FormItem className="w-full"><FormControl><Textarea {...field} disabled={isLoading} className="resize-none min-h-12 border-none focus-within:ring-0 focus-visible:ring-0" /></FormControl></FormItem>} />
      <div className="flex justify-between">
    
              
         
      <Button
        type="submit"
        size="sm"
        className="ml-auto gap-1.5"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
      </div>
    </form>
   </Form>
   </div>
  </section>
  </>
}


export function ChoiceForm({choice,handleChoice}:{choice:MyChoice,handleChoice:(newChoice:MyChoice)=>void}){
  const {setTheme} = useTheme();
  const [open, setOpen] = useState(false)
  const {toast} = useToast();
  
  useEffect(() => {
    document.documentElement.setAttribute('data-mode', choice.mode);
  }, [choice.mode]);

  const formSchema = z.object({
    mode: z.string().min(1, "Mode is required"),
    allergies: z.string().optional(),
    ingredients: z.string().optional(),
    diet: z.string().optional(),
  });

  const form = useForm<MyChoice>({
    resolver: zodResolver(formSchema),
    defaultValues: choice,
  });

  const onSubmit = (values:MyChoice) => {
    handleChoice(values);
    if(values.mode === 'Fitness') setTheme("fitness")
    else if(values.mode === 'Vegan') setTheme("vegan")
    else setTheme("light")
    
    toast({
      title: "Preferences saved",
      description: "Your preferences have been successfully updated.",
      duration: 5000,
    });
    form.reset()
    setOpen(false);
  }

  return <Drawer open={open} onOpenChange={setOpen}>
   <DrawerTrigger asChild>
    <Button variant="ghost" size="icon">
      <span className="sr-only">Preferences</span>
      <Settings className="w-4 h-4" />
    </Button>
   </DrawerTrigger>
    <DrawerContent>
    <div className="mx-auto w-full max-w-sm">     
      <DrawerHeader>
        <DrawerTitle>Preferences</DrawerTitle>
      </DrawerHeader>
      <div className="p-4 pb-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField 
            control={form.control} 
            name="mode" 
            render={({field}) => (
              <FormItem>
                <FormLabel>Mode</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={(value: 'Fitness' | 'Vegan' | 'Normal') => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Fitness">Fitness</SelectItem>
                        <SelectItem value="Vegan">Vegan</SelectItem>
                        <SelectItem value="Normal">Normal</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )} 
          />
          <FormField control={form.control} name="allergies" render={({field}) => <FormItem><FormLabel>Allergies</FormLabel><FormControl><Input {...field} placeholder="e.g. gluten, lactose, nuts" /></FormControl></FormItem>} />
          <FormField control={form.control} name="ingredients" render={({field}) => <FormItem><FormLabel>Ingredients</FormLabel><FormControl><Input {...field} placeholder="e.g. chicken, rice, broccoli" /></FormControl></FormItem>} />
          <FormField control={form.control} name="diet" render={({field}) => <FormItem><FormLabel>Diet</FormLabel><FormControl><Input {...field} placeholder="e.g. keto, paleo, vegetarian" /></FormControl></FormItem>} /> 
          
        </form>
      </Form>
      </div>
      <DrawerFooter>
            <Button
              type="submit"
              className="w-full"
              onClick={form.handleSubmit(onSubmit)}
            >
              Save Preferences
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
    </DrawerContent>
  </Drawer>
}
  
