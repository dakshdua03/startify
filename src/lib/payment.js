// Razorpay Merchant Payment Service

export function getRazorpayKey() {
  const customKey = typeof window !== "undefined" ? localStorage.getItem("startify_razorpay_key") : null;
  return customKey || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_StartifyDemoKey";
}

export function saveRazorpayKey(key) {
  if (typeof window !== "undefined") {
    localStorage.setItem("startify_razorpay_key", key.trim());
  }
}

// Trigger Razorpay Checkout Modal configured with merchant account
export function processRazorpayPayment({ title, amountInINR, userName, userEmail, userContact, onSuccess, onFailure }) {
  const activeKey = getRazorpayKey();
  const amountInPaise = amountInINR * 100;

  if (typeof window !== "undefined" && window.Razorpay) {
    const options = {
      key: activeKey,
      amount: amountInPaise,
      currency: "INR",
      name: "Startify Platform",
      description: `Payment for ${title}`,
      image: "/src/assets/core_team_shield_logo.webp",
      handler: function (response) {
        const paymentRecord = {
          paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
          orderId: response.razorpay_order_id || `order_${Date.now()}`,
          signature: response.razorpay_signature || "verified_signature",
          service: title,
          amount: amountInINR,
          currency: "INR",
          razorpayKeyUsed: activeKey,
          user: userName || "Student Founder",
          email: userEmail || "",
          contact: userContact || "",
          timestamp: new Date().toLocaleString(),
          status: "SUCCESS"
        };
        onSuccess(paymentRecord);
      },
      prefill: {
        name: userName || "",
        email: userEmail || "",
        contact: userContact || ""
      },
      notes: {
        platform: "Startify UoH",
        service: title
      },
      theme: {
        color: "#0A1931"
      },
      modal: {
        ondismiss: function () {
          if (onFailure) onFailure("Payment window closed by user");
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        if (onFailure) onFailure(response.error ? response.error.description : "Payment failed");
      });
      rzp.open();
      return;
    } catch (e) {
      console.warn("Razorpay window open error", e);
    }
  }

  // Fallback demo simulator if script is blocked or offline
  const confirmDemo = window.confirm(
    `[Razorpay Checkout - Merchant Key: ${activeKey}]\n\nService: ${title}\nAmount: ₹${amountInINR}\n\nClick OK to simulate a SUCCESSFUL payment into your Razorpay Account.`
  );

  if (confirmDemo) {
    const mockPayment = {
      paymentId: `pay_rzp_${Date.now()}`,
      orderId: `order_rzp_${Date.now()}`,
      signature: "demo_razorpay_signature",
      service: title,
      amount: amountInINR,
      currency: "INR",
      razorpayKeyUsed: activeKey,
      user: userName || "Student Founder",
      email: userEmail || "",
      contact: userContact || "",
      timestamp: new Date().toLocaleString(),
      status: "SUCCESS"
    };
    onSuccess(mockPayment);
  } else {
    if (onFailure) onFailure("Payment cancelled");
  }
}
