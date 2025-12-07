import EmailSocialForm from '../EmailSocialForm';

export default function EmailSocialFormExample() {
  return (
    <div className="max-w-lg">
      <EmailSocialForm 
        onSubmit={(data) => console.log('Email/Social form submitted:', data)}
        isLoading={false}
      />
    </div>
  );
}
