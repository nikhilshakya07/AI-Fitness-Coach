import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Dumbbell, UtensilsCrossed, Brain } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-6 mb-16">
        <div className="relative inline-block">
          <Sparkles className="h-12 w-12 text-primary mb-4" />
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-50" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Your AI-Powered
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Fitness Coach
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Get personalized workout and diet plans tailored to your goals, fitness level, and preferences. 
          Powered by advanced AI technology.
        </p>
        <Link href="/generate">
          <Button size="lg" className="mt-4">
            Get Started
            <Sparkles className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Personalized Workouts</CardTitle>
            <CardDescription>
              AI-generated workout plans based on your fitness level, goals, and available equipment.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Smart Diet Plans</CardTitle>
            <CardDescription>
              Customized meal plans that match your dietary preferences and nutritional goals.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>AI-Powered Insights</CardTitle>
            <CardDescription>
              Get expert tips, motivation, and lifestyle advice powered by advanced AI.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
