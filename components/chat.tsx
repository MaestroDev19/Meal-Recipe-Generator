"use client";
import { useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Paperclip,
  Mic,
  CornerDownLeft,
  Cog,
  Loader2,
  Eraser,
} from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { FormField, FormItem, FormControl, Form } from "./ui/form";
import { mealChat } from "@/gemini";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import { Drawer, DrawerTrigger } from "./ui/drawer";
import { PreferencesForm } from "./preferences";
import { Preferences } from "@/app/page";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ChatInterface({
  preferences,
  onPreferencesChange,
  onRecipeSearch,
}: {
  onRecipeSearch: (input: string) => Promise<string>;
  preferences: Preferences;
  onPreferencesChange: (preferences: Preferences) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { message } = values;
      setMessages((prev) => [...prev, { text: message, isUser: true }]);

      const aiResponse = await onRecipeSearch(message);
      methods.reset();

      setMessages((prev) => [...prev, { text: aiResponse, isUser: false }]);
    } catch (err: unknown) {
      console.error("Error submitting message:", err);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, an error occurred. Please try again.", isUser: false },
      ]);
    } finally {
      setIsSubmitting(false);
      methods.reset();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className=" h-[calc(100dvh)]">
      <div className="flex  h-full  flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
        <div className="flex-1 overflow-y-auto ">
          <div className="space-y-4 px-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className=" py-4 rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
          >
            <FormField
              control={methods.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      id="message"
                      placeholder="Type your message here..."
                      className="min-h-12 resize-none border-0 p-3 shadow-none focus-within:ring-0 focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center p-3 pt-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        mealChat.resetChat();
                      }}
                    >
                      <Eraser className="size-4" />
                      <span className="sr-only">Clear Chat</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Clear Chat</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PreferencesForm
                      preferences={preferences}
                      onPreferencesChange={onPreferencesChange}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top">Preferences</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                type="submit"
                size="sm"
                className="ml-auto gap-1.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Relax let me cook...</span>
                  </div>
                ) : (
                  "Send Message"
                )}

                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
