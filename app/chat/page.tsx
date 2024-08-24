"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  Turtle,
} from "lucide-react";
import { chef } from "@/gemini";
import ReactMarkdown from "react-markdown";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z.object({
  cuisineStyle: z.string().min(1, "Please select a cuisine style"),
  dishType: z.string().min(1, "Please select a dish type"),
  timeOfDay: z.string().min(1, "Please select a time of day"),
  additionalData: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Dashboard() {
  const cuisineStyles = [
    "French cuisine",
    "Italian cuisine",
    "Japanese cuisine",
    "Korean cuisine",
    "Mexican cuisine",
    "Thai cuisine",
    "Vietnamese cuisine",
    "Chinese cuisine",
    "Indian cuisine",
    "Spanish cuisine",
    "Greek cuisine",
    "Middle Eastern cuisine",
    "African cuisine",
    "Brazilian cuisine",
    "English cuisine",
    "Australian cuisine",
    "New Zealand cuisine",
  ];

  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisineStyle: "",
      dishType: "",
      timeOfDay: "",
      additionalData: "",
    },
  });

  const [messages, setMessages] = useState<{ text: string; role: string }[]>(
    []
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    cuisineStyle: "",
    dishType: "",
    timeOfDay: "",
    additionalData: "",
  });

  const onSubmit = async (message: string) => {
    const userMessage =
      message ||
      `Generate a recipe for a ${formData.dishType} in the ${formData.cuisineStyle} style, suitable for ${formData.timeOfDay}. Additional details: ${formData.additionalData}`;

    setMessages((prev) => [...prev, { text: userMessage, role: "user" }]);

    try {
      const response = await chef(userMessage);
      setMessages((prev) => [...prev, { text: response, role: "assistant" }]);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Error generating recipe. Please try again.",
          role: "assistant",
        },
      ]);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Playground</h1>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings className="size-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>Configuration</DrawerTitle>
                <DrawerDescription>
                  Configure the settings for the model and messages.
                </DrawerDescription>
              </DrawerHeader>
              <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium"></legend>
                  <div className="grid gap-3">
                    <Label htmlFor="model">Model</Label>
                    <Select>
                      <SelectTrigger
                        id="model"
                        className="items-start [&_[data-description]]:hidden"
                      >
                        <SelectValue placeholder="Select a Cusine style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="genesis">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Rabbit className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Neural{" "}
                                <span className="font-medium text-foreground">
                                  Canadian cuisine
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Our fastest model for general use cases.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="explorer">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Bird className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Neural{" "}
                                <span className="font-medium text-foreground">
                                  Explorer
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Performance and speed for efficiency.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="quantum">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Turtle className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Neural{" "}
                                <span className="font-medium text-foreground">
                                  Quantum
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                The most powerful model for complex
                                computations.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input id="temperature" type="number" placeholder="0.4" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-p">Top P</Label>
                    <Input id="top-p" type="number" placeholder="0.7" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-k">Top K</Label>
                    <Input id="top-k" type="number" placeholder="0.0" />
                  </div>
                </fieldset>
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Messages
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" placeholder="You are a..." />
                  </div>
                </fieldset>
              </form>
            </DrawerContent>
          </Drawer>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
          >
            <Share className="size-3.5" />
            Share
          </Button>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Settings
                </legend>
                <div className="grid gap-3">
                  <Label htmlFor="cuisineStyle">Cuisine Style</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, cuisineStyle: value }))
                    }
                  >
                    <SelectTrigger id="cuisineStyle" className="items-start">
                      <SelectValue placeholder="Select a cuisine style" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisineStyles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="dishType">Dish Type</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, dishType: value }))
                    }
                  >
                    <SelectTrigger id="dishType" className="items-start">
                      <SelectValue placeholder="Select a dish type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appetizer">Appetizer</SelectItem>
                      <SelectItem value="main">Main Course</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="timeOfDay">Time of Day</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, timeOfDay: value }))
                    }
                  >
                    <SelectTrigger id="timeOfDay" className="items-start">
                      <SelectValue placeholder="Select a time of day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="anytime">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </fieldset>
              <fieldset className="grid gap-6 h-full rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Additional Information
                </legend>
                <div className="grid gap-3">
                  <Label htmlFor="additionalData">Additional Data</Label>
                  <Textarea
                    id="additionalData"
                    placeholder="Enter any additional information..."
                    className="min-h-[9.5rem]"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        additionalData: e.target.value,
                      }))
                    }
                  />
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge variant="outline" className="absolute right-3 top-3">
              Output
            </Badge>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem(
                  "message"
                ) as HTMLInputElement;
                const message = input.value.trim();
                if (
                  message ||
                  (formData.cuisineStyle &&
                    formData.dishType &&
                    formData.timeOfDay)
                ) {
                  onSubmit(message);
                  input.value = "";
                }
              }}
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            >
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Type your message here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="size-4" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Attach File</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Mic className="size-4" />
                        <span className="sr-only">Use Microphone</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Use Microphone</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                  Send Message
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
