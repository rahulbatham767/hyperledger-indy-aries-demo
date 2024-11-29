import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Relationship() {
  const handleSubmit = () => {};
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="hover:bg-slate-300 text-white hover:text-black">
          Send a New Connection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Relationship</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form>
            <FormItem>
              <FormLabel>Recipients Endpoint DID:</FormLabel>
              <FormControl>
                <Input placeholder="Enter your did" />
              </FormControl>

              <FormMessage />
            </FormItem>
          </Form>
        </div>
        <DialogFooter className={"mx-auto"}>
          {" "}
          <Button variant="ghost">Send Connection request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
