import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Building2 } from 'lucide-react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      icon: Zap,
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started with basic recommendations',
      badge: null,
      features: [
        'Basic collaborative filtering',
        'Up to 1,000 users',
        'Basic analytics dashboard',
        'Email support',
        '5 recommendation algorithms',
        'Standard response time',
      ],
      limitations: [
        'No real-time updates',
        'Limited customization',
        'Basic reporting',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      icon: Crown,
      price: { monthly: 49, annual: 490 },
      description: 'Advanced features for growing businesses',
      badge: 'Most Popular',
      features: [
        'Real-time recommendation updates',
        'Up to 50,000 users',
        'Advanced analytics & insights',
        'Priority email support',
        '15+ recommendation algorithms',
        'Session-based user tracking',
        'Custom recommendation models',
        'A/B testing capabilities',
        'API access',
        'Data export features',
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      icon: Building2,
      price: { monthly: 199, annual: 1990 },
      description: 'Custom solutions for large organizations',
      badge: 'Best Value',
      features: [
        'Unlimited users & items',
        'Custom ML model training',
        'Dedicated account manager',
        '24/7 phone & chat support',
        'Advanced security & compliance',
        'Team collaboration tools',
        'White-label solutions',
        'Custom integrations',
        'On-premise deployment',
        'SLA guarantees',
        'Advanced reporting suite',
        'Multi-tenant architecture',
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your recommendation needs. Start free and scale as you grow.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              Monthly
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-12 h-6 rounded-full p-0"
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-primary transition-transform ${isAnnual ? 'translate-x-5' : ''}`} />
            </Button>
            <span className={isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="rec-badge-new">
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.price.annual : plan.price.monthly;
            
            return (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'rec-card ring-2 ring-primary' : 'rec-card'} transition-all duration-300 hover:scale-105`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className={plan.popular ? 'rec-badge-hot' : 'rec-badge-trending'}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${plan.popular ? 'bg-primary' : 'bg-muted'}`}>
                      <Icon className={`w-6 h-6 ${plan.popular ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">
                      {price === 0 ? 'Free' : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className="text-muted-foreground">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      What's Included
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, Pro plan comes with a 14-day free trial. No credit card required to get started.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, we offer a 30-day money-back guarantee for all paid plans, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}