export default function Resources() {
  const resources = [
    {
      category: 'Crisis Support',
      items: [
        {
          title: '988 Suicide & Crisis Lifeline',
          description: 'Call or text 988 — available 24/7',
          link: 'tel:988',
          cta: 'Call 988',
          highlight: true,
        },
        {
          title: 'Veterans Crisis Line',
          description: 'Press 1 after calling 988, or text 838255',
          link: 'tel:838255',
          cta: 'Text Crisis',
          highlight: true,
        },
        {
          title: 'Crisis Text Line',
          description: 'Text HOME to 741741',
          link: 'sms:741741',
          cta: 'Text Crisis',
          highlight: false,
        },
        {
          title: 'SAMHSA National Helpline',
          description: 'Substance use and mental health support — 1-800-662-4357',
          link: 'tel:1-800-662-4357',
          cta: 'Call SAMHSA',
          highlight: true,
        },
      ],
    },
    {
      category: 'Men\'s Mental Health Organizations',
      items: [
        {
          title: 'The Man Therapy Project',
          description: 'Online resources for men\'s mental health and therapy',
          link: 'https://www.themantherapy.org',
          cta: 'Visit',
        },
        {
          title: 'Men\'s Resource Center',
          description: 'Support for men facing life challenges',
          link: 'https://mensresourcecenter.org',
          cta: 'Learn More',
        },
        {
          title: 'National Alliance on Mental Illness (NAMI)',
          description: 'Support groups and education for mental health',
          link: 'https://www.nami.org',
          cta: 'Visit NAMI',
        },
      ],
    },
    {
      category: 'Addiction & Substance Use',
      items: [
        {
          title: 'Alcoholics Anonymous',
          description: 'Meetings nationwide — peer support for alcohol recovery',
          link: 'https://www.aa.org',
          cta: 'Find Meetings',
        },
        {
          title: 'Narcotics Anonymous',
          description: 'Support for drug addiction recovery',
          link: 'https://www.na.org',
          cta: 'Find Meetings',
        },
        {
          title: 'SMART Recovery',
          description: 'Self-Empowerment and Responsibility Training',
          link: 'https://www.smartrecovery.org',
          cta: 'Learn More',
        },
      ],
    },
    {
      category: 'Therapy & Counseling',
      items: [
        {
          title: 'Psychology Today Therapist Finder',
          description: 'Find licensed therapists in your area',
          link: 'https://www.psychologytoday.com',
          cta: 'Search Therapists',
        },
        {
          title: 'BetterHelp',
          description: 'Online therapy with licensed professionals',
          link: 'https://www.betterhelp.com',
          cta: 'Get Started',
        },
        {
          title: 'Talkspace',
          description: 'Therapy by app — on your time',
          link: 'https://www.talkspace.com',
          cta: 'Learn More',
        },
      ],
    },
    {
      category: 'Divorce & Family Support',
      items: [
        {
          title: 'DadsII',
          description: 'Support and resources for fathers',
          link: 'https://www.dadsii.org',
          cta: 'Visit',
        },
        {
          title: 'Fathers Rights Organization',
          description: 'Legal and support resources for fathers',
          link: 'https://www.fathersrights.org',
          cta: 'Learn More',
        },
      ],
    },
    {
      category: 'PTSD & Trauma',
      items: [
        {
          title: 'VA PTSD Coach',
          description: 'Free app and resources for PTSD management',
          link: 'https://www.ptsd.va.gov',
          cta: 'Visit VA.gov',
        },
        {
          title: 'The Wounded Warrior Project',
          description: 'Support for veterans and military families',
          link: 'https://www.woundedwarriorproject.org',
          cta: 'Learn More',
        },
      ],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 border-b border-dark-700 bg-gradient-to-r from-dark-900 via-dark-900 to-dark-800">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">Resources</h1>
          <p className="text-lg text-steel max-w-2xl">
            We're not the solution. We're the start. Here's where to find real help.
          </p>
        </div>
      </section>

      {/* Crisis Banner */}
      <section className="bg-red-900/20 border-b-4 border-red-600 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-condensed tracking-wider text-red-400 uppercase mb-3">Crisis Support</p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div>
              <p className="text-lg font-serif font-bold text-white mb-2">Need to talk now?</p>
              <a
                href="tel:988"
                className="inline-block text-2xl sm:text-3xl font-bold text-red-400 hover:text-red-300 transition-colors"
              >
                Call or text 988
              </a>
            </div>
            <div className="border-l border-red-600/50 pl-4 sm:pl-8">
              <p className="text-sm text-red-200 mb-2">Available 24/7 — staffed by real people who get it</p>
              <p className="text-sm text-red-200">Veterans: Press 1. Or text 838255.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="space-y-16">
          {resources.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-8 pb-4 border-b border-dark-700">
                {section.category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className={`p-6 rounded-sm ${
                      item.highlight
                        ? 'bg-red-900/30 border-l-4 border-red-600'
                        : 'bg-dark-800 border-l-4 border-dark-700'
                    }`}
                  >
                    <h3 className="text-lg font-serif font-bold mb-2">{item.title}</h3>
                    <p className="text-steel mb-4 text-sm">{item.description}</p>
                    <a
                      href={item.link}
                      target={item.link.startsWith('http') ? '_blank' : undefined}
                      rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={`inline-block text-sm font-condensed tracking-wider transition-colors ${
                        item.highlight
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-amber hover:text-amber/80'
                      }`}
                    >
                      {item.cta} →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <section className="bg-dark-800 py-12 px-4 mt-8 border-t border-dark-700">
        <div className="max-w-2xl mx-auto text-center text-sm text-steel">
          <p className="mb-4">
            What Men Carry is a community platform, not a treatment provider. We are committed to connecting you with resources and support.
          </p>
          <p>
            If you are in immediate danger, call 911 or go to your nearest emergency room.
          </p>
        </div>
      </section>
    </>
  );
}
