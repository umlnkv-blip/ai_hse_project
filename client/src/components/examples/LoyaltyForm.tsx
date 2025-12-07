import LoyaltyForm from '../LoyaltyForm';

export default function LoyaltyFormExample() {
  return (
    <div className="max-w-lg">
      <LoyaltyForm 
        onSubmit={(data) => console.log('Loyalty form submitted:', data)}
        isLoading={false}
      />
    </div>
  );
}
