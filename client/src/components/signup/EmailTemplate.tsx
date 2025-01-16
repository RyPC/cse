import { Button, Html } from "@react-email/components";

function EmailTemplate({
  firstName,
  lastName,
  email,
  role,
}: {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}) {
  return (
    <Html>
      <div>
        <h1>New Member, Onboarding Approval Required</h1>
        <p>A new team member has registered and requires your approval:</p>
        <ul>
          <li>
            <strong>Name:</strong> {firstName} {lastName}
          </li>
          <li>
            <strong>Email:</strong> {email}
          </li>
          <li>
            <strong>Role:</strong> {role}
          </li>
        </ul>
        <p>Please review the details and approve the onboarding process.</p>
        <Button
          href="" // Add approval endpoint
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Approve
        </Button>
      </div>
    </Html>
  );
}

export default EmailTemplate;
