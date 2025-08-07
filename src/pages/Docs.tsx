import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Book, Code, Zap, Users, BarChart3, Settings, Cpu, Database } from 'lucide-react';

export default function Docs() {
  const sections = [
    {
      title: 'Getting Started',
      icon: Book,
      items: [
        { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes' },
        { title: 'Installation', description: 'Set up the recommendation system' },
        { title: 'Basic Configuration', description: 'Configure your first recommender' },
      ]
    },
    {
      title: 'API Reference',
      icon: Code,
      items: [
        { title: 'Authentication', description: 'Secure API access methods' },
        { title: 'Recommendation Endpoints', description: 'Core recommendation APIs' },
        { title: 'User Management', description: 'User profile and preference APIs' },
        { title: 'Analytics APIs', description: 'Access recommendation metrics' },
      ]
    },
    {
      title: 'Algorithms',
      icon: Cpu,
      items: [
        { title: 'Collaborative Filtering', description: 'User-based and item-based CF' },
        { title: 'Content-Based Filtering', description: 'Item feature recommendations' },
        { title: 'Hybrid Approaches', description: 'Combining multiple algorithms' },
        { title: 'Cold Start Solutions', description: 'Handling new users and items' },
      ]
    },
    {
      title: 'Data Management',
      icon: Database,
      items: [
        { title: 'Data Models', description: 'User, item, and interaction schemas' },
        { title: 'Import/Export', description: 'Data migration and backup' },
        { title: 'Real-time Streaming', description: 'Live data ingestion' },
      ]
    }
  ];

  const features = [
    {
      title: 'Real-time Recommendations',
      description: 'Get instant recommendations as user behavior changes',
      icon: Zap,
      status: 'Available'
    },
    {
      title: 'Collaborative Filtering',
      description: 'Advanced user-item collaborative filtering algorithms',
      icon: Users,
      status: 'Available'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive metrics and performance insights',
      icon: BarChart3,
      status: 'Available'
    },
    {
      title: 'Custom Models',
      description: 'Train and deploy your own recommendation models',
      icon: Settings,
      status: 'Coming Soon'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text">
            Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn how to integrate and use our powerful recommendation system in your applications.
          </p>
        </div>

        {/* Features Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="rec-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Icon className="w-8 h-8 text-primary" />
                      <Badge 
                        variant={feature.status === 'Available' ? 'default' : 'secondary'}
                        className={feature.status === 'Available' ? 'rec-badge-new' : ''}
                      >
                        {feature.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-12">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title}>
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((item) => (
                    <Card key={item.title} className="rec-card cursor-pointer hover:scale-105 transition-transform">
                      <CardHeader>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
                <Separator className="mt-8" />
              </div>
            );
          })}
        </div>

        {/* Code Example */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Quick Start Example</h2>
          <Card className="rec-card">
            <CardHeader>
              <CardTitle>Basic Recommendation Request</CardTitle>
              <CardDescription>
                Get personalized recommendations for a user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`// Initialize the recommendation engine
const recommender = new RecommendationEngine({
  apiKey: 'your-api-key',
  algorithm: 'collaborative-filtering'
});

// Get recommendations for a user
const recommendations = await recommender.getRecommendations({
  userId: 'user_123',
  limit: 10,
  categories: ['action', 'drama']
});

console.log(recommendations);
// Output: Array of recommended items with scores`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <Card className="rec-card">
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Our team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@recommendai.com"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="https://github.com/recommendai/docs"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
              >
                View on GitHub
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}