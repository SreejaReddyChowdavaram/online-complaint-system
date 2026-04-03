import React from 'react';
import ComplaintCard from '../components/ComplaintCard';

const PreviewCards = () => {
  const mockComplaints = [
    {
      _id: '1',
      title: 'Water Leakage in Main Street',
      description: 'There is a major water pipe burst near the city hospital. Thousands of gallons are being wasted.',
      category: 'Water',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      upvotes: 12,
      downvotes: 2,
      commentCount: 5,
    },
    {
      _id: '2',
      title: 'Power Outage in Central Area',
      description: 'Electricity has been out for the last 5 hours in the residential blocks of Central Park.',
      category: 'Electricity',
      status: 'In Progress',
      createdAt: new Date().toISOString(),
      upvotes: 45,
      downvotes: 1,
      commentCount: 12,
    },
    {
      _id: '3',
      title: 'Broken Street Light',
      description: 'The street light on the corner of 5th and Oak is completely dark, causing safety concerns.',
      category: 'Electricity',
      status: 'Resolved',
      createdAt: new Date().toISOString(),
      upvotes: 8,
      downvotes: 0,
      commentCount: 2,
    },
    {
      _id: '4',
      title: 'Garbage Overflow near School',
      description: 'The community bin near the primary school is overflowing and hasn\'t been cleared for a week.',
      category: 'Garbage',
      status: 'Assigned',
      createdAt: new Date().toISOString(),
      upvotes: 24,
      downvotes: 5,
      commentCount: 8,
    },
  ];

  return (
    <div className="p-10 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-slate-800 dark:text-slate-100">UI Refinement: Thick 4px Solid Borders</h1>
      
      <div className="complaints-grid">
        {mockComplaints.map(c => (
          <ComplaintCard 
            key={c._id} 
            complaint={c} 
            onCardClick={(comp) => console.log('Clicked', comp)}
            onUpvote={(id) => console.log('Upvote', id)}
            onDownvote={(id) => console.log('Downvote', id)}
            onCommentClick={(comp) => console.log('Comment', comp)}
            onRateClick={c.status === 'Resolved' ? (comp) => console.log('Rate', comp) : null}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewCards;
