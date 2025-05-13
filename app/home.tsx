"use client"

import { generateRecipe } from "@/lib/recipe-service"
import type { Message, RecipePreferences } from "@/types/recipe"
import { useEffect, useRef, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTheme } from "next-themes"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import Markdown from "react-markdown"
import { Select, SelectContent, SelectValue, SelectTrigger, SelectGroup, SelectItem } from "@/components/ui/select"

export default function ChatPage() {
  return <Chat />
}

export function Chat() {
  const [preferences, setPreferences] = useState<RecipePreferences>({
    mode: "Normal",
    allergies: "",
    ingredients: "",
    diet: "",
  })
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formSchema = z.object({
    prompt: z.string().min(1, "Message is required"),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      setMessages((prev) => [...prev, { role: "user", content: values.prompt }])
      form.reset()

      const recipe = await generateRecipe(values.prompt, preferences)
      setMessages((prev) => [...prev, { role: "assistant", content: recipe }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "An error occurred while generating the recipe. Please try again later." },
      ])
      console.error("Error generating recipe:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <header className="p-5 sticky top-0 bg-background z-10">
        <nav className="flex justify-between">
          <Link href="/">Home</Link>
          <PreferencesForm preferences={preferences} onPreferencesChange={setPreferences} />
        </nav>
      </header>
      <section className="h-[calc(100dvh-80px)]">
        <div className="h-full w-full flex flex-col">
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col gap-4 p-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} w-full`}>
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-3 text-sm ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <span className="break-words">
                      <Markdown>{message.content}</Markdown>
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-background gap-2 p-4 m-4 border rounded-lg space-y-2"
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isLoading}
                        className="resize-none min-h-12 border-none focus-within:ring-0 focus-visible:ring-0"
                        placeholder="Describe the recipe you want to generate..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Recipe"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </>
  )
}

function PreferencesForm({
  preferences,
  onPreferencesChange,
}: {
  preferences: RecipePreferences
  onPreferencesChange: (preferences: RecipePreferences) => void
}) {
  const { setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", preferences.mode)
  }, [preferences.mode])

  const formSchema = z.object({
    mode: z.enum(["Fitness", "Vegan", "Normal"]),
    allergies: z.string().default(""),
    ingredients: z.string().default(""),
    diet: z.string().default(""),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: preferences.mode,
      allergies: preferences.allergies || "",
      ingredients: preferences.ingredients || "",
      diet: preferences.diet || "",
    },
  })

  // Reset form values when preferences change
  useEffect(() => {
    form.reset({
      mode: preferences.mode,
      allergies: preferences.allergies || "",
      ingredients: preferences.ingredients || "",
      diet: preferences.diet || "",
    })
  }, [preferences, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onPreferencesChange({
      mode: values.mode,
      allergies: values.allergies,
      ingredients: values.ingredients,
      diet: values.diet,
    })

    if (values.mode === "Fitness") setTheme("fitness")
    else if (values.mode === "Vegan") setTheme("vegan")
    else setTheme("light")

    toast({
      title: "Preferences saved",
      description: "Your preferences have been successfully updated.",
      duration: 5000,
    })

    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <span className="sr-only">Preferences</span>
          <Settings className="w-4 h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Recipe Preferences</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipe Mode</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value: "Fitness" | "Vegan" | "Normal") => field.onChange(value)}
                          value={field.value}
                          defaultValue="Normal"
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
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. gluten, lactose, nuts" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredients</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. chicken, rice, broccoli" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="diet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diet</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. keto, paleo, vegetarian" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <DrawerFooter>
            <Button type="submit" className="w-full" onClick={form.handleSubmit(onSubmit)}>
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
  )
}
