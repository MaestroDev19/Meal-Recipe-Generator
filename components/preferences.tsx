import { Preferences } from "@/app/page";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "./ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";

import { useToast } from "@/components/ui/use-toast";
import { Cog } from "lucide-react";

export function PreferencesForm({
  preferences,
  onPreferencesChange,
}: {
  preferences: Preferences;
  onPreferencesChange: (preferences: Preferences) => void;
}) {
  const { toast } = useToast();
  const preferencesSchema = z.object({
    allergies: z.array(z.string()).optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
    dietaryPreferences: z.array(z.string()).optional(),
    cuisine: z.enum([
      "italian",
      "mexican",
      "french",
      "japanese",
      "korean",
      "chinese",
      "thai",
      "vietnamese",
      "indian",
      "brazilian",
      "american",
      "nigerian",
    ]),
  });
  const form = useForm<Preferences>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: preferences,
  });
  const onSubmit = (data: Preferences) => {
    onPreferencesChange(data);
    toast({
      title: "Preferences saved",
      description: "Your preferences have been successfully updated.",
      duration: 5000,
    });
    form.reset();
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Cog className="size-4" />
          <span className="sr-only">Preferences</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Preferences</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 mb-4"
              >
                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Level</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a skill level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Cuisine</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a cuisine" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="italian">Italian</SelectItem>
                            <SelectItem value="mexican">Mexican</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="japanese">Japanese</SelectItem>
                            <SelectItem value="korean">Korean</SelectItem>
                            <SelectItem value="chinese">Chinese</SelectItem>
                            <SelectItem value="thai">Thai</SelectItem>
                            <SelectItem value="vietnamese">
                              Vietnamese
                            </SelectItem>
                            <SelectItem value="indian">Indian</SelectItem>
                            <SelectItem value="brazilian">Brazilian</SelectItem>
                            <SelectItem value="american">American</SelectItem>
                            <SelectItem value="nigerian">Nigerian</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dietaryPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Preferences</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="E.g., vegetarian, low-carb, keto"
                        />
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
                        <Textarea
                          {...field}
                          placeholder="E.g., peanuts, shellfish, dairy"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
  );
}
