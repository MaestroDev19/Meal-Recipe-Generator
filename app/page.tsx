"use client";
import { chef } from "@/lib/gemini";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface Message {
  text: string;
  role: string;
}

const formSchema = z.object({
  message: z.string(),
});

export default function Home() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setMessages((prev) => [...prev, { text: values.message, role: "user" }]);

    // Add loading message
    setMessages((prev) => [...prev, { text: "Loading...", role: "model" }]);
    setIsLoading(true);

    try {
      const message = await chef(values.message);

      // Remove the loading message
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: message, role: "model" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "Error occurred while fetching the response.", role: "model" },
      ]);
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  return (
    <div className="h-[calc(100dvh)]">
      <div className="bg-card text-card-foreground pt-5 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex w-max max-w-[100%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                  message.role === "model"
                    ? "bg-muted"
                    : "ml-auto bg-primary text-primary-foreground"
                }`}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="py-4 px-4">
          <Form {...form}>
            <form
              className="flex flex-col w-full items-center space-y-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="relative w-full">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          id="message"
                          autoComplete="off"
                          rows={1}
                          className="pr-24 resize-none overflow-y-auto min-h-[40px] max-h-[120px] focus:outline-none focus:ring-0 border bg-muted"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="absolute right-2 bottom-1 flex space-x-2">
                  <Button
                    type="submit"
                    size="icon"
                    variant={"ghost"}
                    className="h-8 w-8"
                    disabled={isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
