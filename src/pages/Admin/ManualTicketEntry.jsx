// import React, { useState, useEffect } from "react";
// import { adminAPI } from "../../services/apiService";
// import "./ManualTicketEntry.css";
// import { toast } from "react-toastify";

// const ManualTicketEntry = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     adultTicketCount: 1,
//     childrenTicketCount: 0,
//     adultTicketPrice: "", // Admin can enter custom price
//     childrenTicketPrice: 999, // Fixed at 999
//     totalAmount: "",
//     paymentMethod: "cash",
//     notes: "",
//   });
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");
//   const [createdTicket, setCreatedTicket] = useState(null);
//   const [ticketInfo, setTicketInfo] = useState({
//     defaultAdultPrice: 2299, // Default price from server
//     maxAdultTickets: 100,
//     availableTickets: 100,
//     isDiscountEnabled: false, // Whether discount is enabled
//   });

//   // Constants
//   const DISCOUNT_PER_TICKET = 300; // ₹300 discount per adult ticket for 2+ tickets

//   // Calculate total amount whenever ticket counts or price changes
//   useEffect(() => {
//     calculateTotalAmount();
//   }, [
//     formData.adultTicketCount,
//     formData.childrenTicketCount,
//     formData.adultTicketPrice,
//     formData.adultTicketCount > 1 && ticketInfo.isDiscountEnabled
//   ]);

//   const calculateTotalAmount = () => {
//     let adultAmount = 0;
//     let childrenAmount = 0;
//     let discount = 0;
    
//     // Calculate adult amount
//     const adultPrice = parseFloat(formData.adultTicketPrice) || ticketInfo.defaultAdultPrice;
//     const adultCount = formData.adultTicketCount;
    
//     if (adultCount > 0) {
//       if (adultCount > 1 && ticketInfo.isDiscountEnabled) {
//         // Apply discount for 2+ adult tickets
//         const discountedPricePerTicket = adultPrice - DISCOUNT_PER_TICKET;
//         adultAmount = discountedPricePerTicket * adultCount;
//         discount = DISCOUNT_PER_TICKET * adultCount;
//       } else {
//         // No discount for single ticket or if discount disabled
//         adultAmount = adultPrice * adultCount;
//       }
//     }
    
//     // Calculate children amount (always fixed price)
//     const childrenPrice = formData.childrenTicketPrice;
//     childrenAmount = formData.childrenTicketCount * childrenPrice;
    
//     const totalAmount = adultAmount + childrenAmount;
    
//     setFormData(prev => ({
//       ...prev,
//       totalAmount: totalAmount || 0
//     }));
//   };

//   const calculateDiscountedPrice = () => {
//     const adultPrice = parseFloat(formData.adultTicketPrice) || ticketInfo.defaultAdultPrice;
//     if (formData.adultTicketCount > 1 && ticketInfo.isDiscountEnabled) {
//       return adultPrice - DISCOUNT_PER_TICKET;
//     }
//     return adultPrice;
//   };

//   const calculateTotalSavings = () => {
//     if (formData.adultTicketCount > 1 && ticketInfo.isDiscountEnabled) {
//       return DISCOUNT_PER_TICKET * formData.adultTicketCount;
//     }
//     return 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === "adultTicketCount" || name === "childrenTicketCount") {
//       const count = parseInt(value) || 0;
//       if (count < 0) return;
      
//       setFormData({
//         ...formData,
//         [name]: count
//       });
//     } else if (name === "adultTicketPrice") {
//       // Allow only numbers and decimal point
//       const priceValue = value.replace(/[^0-9.]/g, '');
//       if (priceValue.split('.').length > 2) return; // Prevent multiple decimal points
      
//       setFormData({
//         ...formData,
//         [name]: priceValue
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   const applyDefaultPrice = () => {
//     setFormData(prev => ({
//       ...prev,
//       adultTicketPrice: ticketInfo.defaultAdultPrice.toString()
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!formData.name || !formData.email || !formData.phone) {
//       setMessage("Please fill in all required fields");
//       setMessageType("error");
//       return;
//     }

//     if (!formData.email.includes("@") || !formData.email.includes(".")) {
//       setMessage("Please enter a valid email address");
//       setMessageType("error");
//       return;
//     }

//     if (formData.phone.length < 10) {
//       setMessage("Please enter a valid phone number");
//       setMessageType("error");
//       return;
//     }

//     if (formData.adultTicketCount === 0 && formData.childrenTicketCount === 0) {
//       setMessage("Please select at least one ticket");
//       setMessageType("error");
//       return;
//     }

//     // Check if adult ticket price is valid
//     const adultPrice = parseFloat(formData.adultTicketPrice) || ticketInfo.defaultAdultPrice;
//     if (adultPrice <= 0) {
//       setMessage("Please enter a valid adult ticket price");
//       setMessageType("error");
//       return;
//     }

//     // Check if total adult tickets exceed available tickets
//     if (formData.adultTicketCount > ticketInfo.availableTickets) {
//       setMessage(`Only ${ticketInfo.availableTickets} adult tickets available`);
//       setMessageType("error");
//       return;
//     }

//     setIsLoading(true);
//     setMessage("");

//     try {
//       const ticketData = {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         adultTicketCount: formData.adultTicketCount,
//         childrenTicketCount: formData.childrenTicketCount,
//         adultTicketPrice: parseFloat(formData.adultTicketPrice) || ticketInfo.defaultAdultPrice,
//         childrenTicketPrice: formData.childrenTicketPrice,
//         totalAmount: formData.totalAmount,
//         paymentMethod: formData.paymentMethod,
//         notes: formData.notes,
//         discountApplied: formData.adultTicketCount > 1 && ticketInfo.isDiscountEnabled,
//         discountAmount: calculateTotalSavings()
//       };

//       console.log('Submitting ticket data:', ticketData);

//       const response = await adminAPI.createManualTicket(ticketData);

//       if (response.data.success) {
//         toast.success("Ticket created successfully!");
//         setMessageType("success");
//         setCreatedTicket(response.data.data.ticket);

//         // Reset form
//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//           adultTicketCount: 1,
//           childrenTicketCount: 0,
//           adultTicketPrice: ticketInfo.defaultAdultPrice.toString(),
//           childrenTicketPrice: 999,
//           totalAmount: "",
//           paymentMethod: "cash",
//           notes: "",
//         });

//         // Auto-clear success message
//         setTimeout(() => setMessage(""), 5000);
//       }
//     } catch (error) {
//       console.error('Error creating ticket:', error);
//       toast.error(error.response?.data?.message || "Failed to create ticket");
//       setMessageType("error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch ticket information on component mount
//   useEffect(() => {
//     fetchTicketInfo();
//   }, []);

//   const fetchTicketInfo = async () => {
//     try {
//       const response = await adminAPI.getTicketInfo();
//       if (response.data.success) {
//         const info = response.data.data;
//         setTicketInfo({
//           defaultAdultPrice: info.ticketPrice || 2299,
//           maxAdultTickets: info.maxAdultTickets || 10,
//           availableTickets: info.availableTickets || 100,
//           isDiscountEnabled: info.isDiscountEnabled !== false // Default to true if not specified
//         });
        
//         // Set default adult ticket price
//         setFormData(prev => ({
//           ...prev,
//           adultTicketPrice: (info.ticketPrice || 2299).toString()
//         }));
//       }
//     } catch (error) {
//       console.error("Failed to fetch ticket info:", error);
//     }
//   };

//   const discountedPrice = calculateDiscountedPrice();
//   const totalSavings = calculateTotalSavings();
//   const totalTickets = formData.adultTicketCount + formData.childrenTicketCount;
//   const adultPrice = parseFloat(formData.adultTicketPrice) || ticketInfo.defaultAdultPrice;

//   return (
//     <div className="manual-ticket-entry">
//       <div className="entry-header">
//         <h2>Manual Ticket Entry</h2>
//         <p>Create tickets for cash/UPI payments with custom pricing</p>
//         <div className="ticket-info-banner">
//           <span className="info-item">💰 Adult: Custom Price</span>
//           <span className="info-item">👶 Children (5-10): ₹{formData.childrenTicketPrice} (Fixed)</span>
//           {ticketInfo.isDiscountEnabled && (
//             <span className="info-item">🎉 Discount: ₹{DISCOUNT_PER_TICKET} off per adult ticket on 2+ tickets</span>
//           )}
//           <span className="info-item">📊 Available Adult Tickets: {ticketInfo.availableTickets}</span>
//         </div>
//       </div>

//       <div className="entry-container">
//         {/* Form Section */}
//         <div className="form-section">
//           <form onSubmit={handleSubmit} className="ticket-form">
//             {message && (
//               <div className={`message ${messageType}`}>{message}</div>
//             )}

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="name">
//                   Customer Name <span className="required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   placeholder="Enter customer name"
//                   required
//                   disabled={isLoading}
//                   className="form-control"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="email">
//                   Email Address <span className="required">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="customer@example.com"
//                   required
//                   disabled={isLoading}
//                   className="form-control"
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="phone">
//                   Phone Number <span className="required">*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   placeholder="+91 98765 43210"
//                   required
//                   disabled={isLoading}
//                   className="form-control"
//                   pattern="[0-9]{10}"
//                   title="Please enter a 10-digit phone number"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="adultTicketCount">
//                   Adult Tickets <span className="required">*</span>
//                 </label>
//                 <div className="ticket-count-control">
//                   <button
//                     type="button"
//                     className="count-btn"
//                     onClick={() => {
//                       if (formData.adultTicketCount > 0) {
//                         setFormData({
//                           ...formData,
//                           adultTicketCount: formData.adultTicketCount - 1
//                         });
//                       }
//                     }}
//                     disabled={isLoading || formData.adultTicketCount === 0}
//                   >
//                     -
//                   </button>
//                   <input
//                     type="number"
//                     id="adultTicketCount"
//                     name="adultTicketCount"
//                     value={formData.adultTicketCount}
//                     onChange={handleInputChange}
//                     min="0"
//                     max={ticketInfo.maxAdultTickets}
//                     disabled={isLoading}
//                     className="ticket-count-input"
//                   />
//                   <button
//                     type="button"
//                     className="count-btn"
//                     onClick={() => {
//                       if (formData.adultTicketCount < ticketInfo.maxAdultTickets) {
//                         setFormData({
//                           ...formData,
//                           adultTicketCount: formData.adultTicketCount + 1
//                         });
//                       }
//                     }}
//                     disabled={isLoading || formData.adultTicketCount >= ticketInfo.maxAdultTickets}
//                   >
//                     +
//                   </button>
//                 </div>
//                 <div className="ticket-hint">
//                   {formData.adultTicketCount > 1 && ticketInfo.isDiscountEnabled ? (
//                     <span className="text-success">
//                       ✓ ₹{DISCOUNT_PER_TICKET} off per ticket applied!
//                     </span>
//                   ) : (
//                     ticketInfo.isDiscountEnabled ? "Add 2+ adult tickets for discount" : ""
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="childrenTicketCount">
//                   Children Tickets (5-10 years)
//                 </label>
//                 <div className="ticket-count-control">
//                   <button
//                     type="button"
//                     className="count-btn"
//                     onClick={() => {
//                       if (formData.childrenTicketCount > 0) {
//                         setFormData({
//                           ...formData,
//                           childrenTicketCount: formData.childrenTicketCount - 1
//                         });
//                       }
//                     }}
//                     disabled={isLoading || formData.childrenTicketCount === 0}
//                   >
//                     -
//                   </button>
//                   <input
//                     type="number"
//                     id="childrenTicketCount"
//                     name="childrenTicketCount"
//                     value={formData.childrenTicketCount}
//                     onChange={handleInputChange}
//                     min="0"
//                     max={ticketInfo.maxAdultTickets}
//                     disabled={isLoading}
//                     className="ticket-count-input"
//                   />
//                   <button
//                     type="button"
//                     className="count-btn"
//                     onClick={() => {
//                       if (formData.childrenTicketCount < ticketInfo.maxAdultTickets) {
//                         setFormData({
//                           ...formData,
//                           childrenTicketCount: formData.childrenTicketCount + 1
//                         });
//                       }
//                     }}
//                     disabled={isLoading || formData.childrenTicketCount >= ticketInfo.maxAdultTickets}
//                   >
//                     +
//                   </button>
//                 </div>
//                 <div className="ticket-hint">
//                   Fixed price: ₹{formData.childrenTicketPrice}
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="adultTicketPrice">
//                   Adult Ticket Price (₹) <span className="required">*</span>
//                 </label>
//                 <div className="price-input-group">
//                   <input
//                     type="text"
//                     id="adultTicketPrice"
//                     name="adultTicketPrice"
//                     value={formData.adultTicketPrice}
//                     onChange={handleInputChange}
//                     placeholder="Enter price"
//                     required
//                     disabled={isLoading}
//                     className="form-control price-input"
//                   />
//                   <button
//                     type="button"
//                     className="default-price-btn"
//                     onClick={applyDefaultPrice}
//                     disabled={isLoading}
//                     title="Use default price"
//                   >
//                     ₹{ticketInfo.defaultAdultPrice}
//                   </button>
//                 </div>
//                 <div className="price-hint">
//                   Default price: ₹{ticketInfo.defaultAdultPrice}
//                 </div>
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="totalAmount">Total Amount (₹)</label>
//                 <input
//                   type="text"
//                   id="totalAmount"
//                   name="totalAmount"
//                   value={`₹${formData.totalAmount || 0}`}
//                   readOnly
//                   className="readonly form-control total-amount-input"
//                 />
//                 <div className="amount-breakdown">
//                   {formData.adultTicketCount > 0 && (
//                     <div className="breakdown-item">
//                       <span>
//                         Adult ({formData.adultTicketCount} × 
//                         {formData.adultTicketCount > 1 && ticketInfo.isDiscountEnabled ? (
//                           <>
//                             <span className="original-price">₹{adultPrice}</span>
//                             ₹{discountedPrice}
//                           </>
//                         ) : (
//                           ` ₹${adultPrice}`
//                         )}):
//                       </span>
//                       <span>
//                         ₹{formData.adultTicketCount > 1 && ticketInfo.isDiscountEnabled ? 
//                           formData.adultTicketCount * discountedPrice : 
//                           formData.adultTicketCount * adultPrice}
//                       </span>
//                     </div>
//                   )}
                  
//                   {formData.childrenTicketCount > 0 && (
//                     <div className="breakdown-item">
//                       <span>Children ({formData.childrenTicketCount} × ₹{formData.childrenTicketPrice}):</span>
//                       <span>₹{formData.childrenTicketCount * formData.childrenTicketPrice}</span>
//                     </div>
//                   )}
                  
//                   {totalSavings > 0 && (
//                     <div className="breakdown-item text-success">
//                       <span>Discount:</span>
//                       <span>-₹{totalSavings}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="totalTickets">Total Tickets</label>
//                 <div className="total-tickets-display">
//                   <span className="ticket-count-badge">{totalTickets}</span>
//                   <div className="ticket-composition">
//                     {formData.adultTicketCount > 0 && (
//                       <span className="ticket-type adult">
//                         {formData.adultTicketCount} Adult
//                       </span>
//                     )}
//                     {formData.childrenTicketCount > 0 && (
//                       <span className="ticket-type children">
//                         {formData.childrenTicketCount} Children
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="paymentMethod">Payment Method</label>
//                 <div className="payment-methods">
//                   {["cash", "upi", "online"].map((method) => (
//                     <label key={method} className="payment-method">
//                       <input
//                         type="radio"
//                         name="paymentMethod"
//                         value={method}
//                         checked={formData.paymentMethod === method}
//                         onChange={handleInputChange}
//                         disabled={isLoading}
//                       />
//                       <span className="payment-label">
//                         {method === "cash" ? "💵 Cash" : 
//                          method === "upi" ? "📱 UPI" : 
//                          "💳 Online"}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* <div className="form-group">
//                 <label htmlFor="applyDiscount">Discount Settings</label>
//                 <div className="discount-controls">
//                   <div className="discount-toggle">
//                     <label className="toggle-switch">
//                       <input
//                         type="checkbox"
//                         checked={ticketInfo.isDiscountEnabled}
//                         onChange={() => {
//                           setTicketInfo(prev => ({
//                             ...prev,
//                             isDiscountEnabled: !prev.isDiscountEnabled
//                           }));
//                         }}
//                         disabled={isLoading}
//                       />
//                       <span className="toggle-slider"></span>
//                     </label>
//                     <span className="toggle-label">
//                       Apply ₹{DISCOUNT_PER_TICKET} discount for 2+ adult tickets
//                     </span>
//                   </div>
//                   {formData.adultTicketCount > 1 && ticketInfo.isDiscountEnabled && (
//                     <div className="discount-info text-success">
//                       ✓ Discount applied: ₹{DISCOUNT_PER_TICKET} × {formData.adultTicketCount} = ₹{totalSavings}
//                     </div>
//                   )}
//                 </div>
//               </div> */}
//             </div>

//             <div className="form-group">
//               <label htmlFor="notes">Notes (Optional)</label>
//               <textarea
//                 id="notes"
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleInputChange}
//                 placeholder="Any additional notes, special requirements, custom pricing reason, etc..."
//                 rows="3"
//                 disabled={isLoading}
//                 className="form-control"
//               />
//             </div>

//             <button
//               type="submit"
//               className="create-ticket-btn"
//               disabled={isLoading || totalTickets === 0 || !formData.adultTicketPrice}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="spinner"></span>
//                   Creating Ticket...
//                 </>
//               ) : (
//                 `Create Ticket - ₹${formData.totalAmount || 0}`
//               )}
//             </button>
//           </form>
//         </div>

      
//       </div>
//     </div>
//   );
// };

// export default ManualTicketEntry;


import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/apiService";
import "./ManualTicketEntry.css";
import { toast } from "react-toastify";

const ManualTicketEntry = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadharNumber: "",
    adultTicketCount: 1,
    childrenTicketCount: 0,
    adultTicketPrice: "", // Admin can enter custom price
    childrenTicketPrice: 999, // Can also be customized
    totalAmount: "",
    paymentMethod: "cash",
    notes: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [ticketInfo, setTicketInfo] = useState({
    defaultAdultPrice: 2299, // Default price from server
    defaultChildrenPrice: 999, // Default children price from server
    maxAdultTickets: 100,
    availableTickets: 100,
  });

  // Calculate total amount whenever ticket counts or price changes
  useEffect(() => {
    calculateTotalAmount();
  }, [
    formData.adultTicketCount,
    formData.childrenTicketCount,
    formData.adultTicketPrice,
    formData.childrenTicketPrice
  ]);

  const calculateTotalAmount = () => {
    let adultAmount = 0;
    let childrenAmount = 0;
    
    // Calculate adult amount
    const adultPrice = parseFloat(formData.adultTicketPrice) || ticketInfo.defaultAdultPrice;
    const adultCount = formData.adultTicketCount;
    
    if (adultCount > 0) {
      adultAmount = adultPrice * adultCount;
    }
    
    // Calculate children amount (can be customized)
    const childrenPrice = parseFloat(formData.childrenTicketPrice) || ticketInfo.defaultChildrenPrice;
    childrenAmount = formData.childrenTicketCount * childrenPrice;
    
    const totalAmount = adultAmount + childrenAmount;
    
    setFormData(prev => ({
      ...prev,
      totalAmount: totalAmount || 0
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "adultTicketCount" || name === "childrenTicketCount") {
      const count = parseInt(value) || 0;
      if (count < 0) return;
      
      setFormData({
        ...formData,
        [name]: count
      });
    } else if (name === "adultTicketPrice" || name === "childrenTicketPrice") {
      // Allow only numbers and decimal point
      const priceValue = value.replace(/[^0-9.]/g, '');
      if (priceValue.split('.').length > 2) return;
      
      setFormData({
        ...formData,
        [name]: priceValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const applyDefaultPrice = (type) => {
    if (type === 'adult') {
      setFormData(prev => ({
        ...prev,
        adultTicketPrice: ticketInfo.defaultAdultPrice.toString()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        childrenTicketPrice: ticketInfo.defaultChildrenPrice.toString()
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation - Email is optional, but need either phone or Aadhar
    if (!formData.name) {
      toast.error("Customer name is required");
      return;
    }

    if (!formData.phone && !formData.aadharNumber) {
      toast.error("Please provide either phone number or Aadhar number");
      return;
    }

    if (formData.phone && formData.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (formData.aadharNumber && formData.aadharNumber.length < 12) {
      toast.error("Please enter a valid 12-digit Aadhar number");
      return;
    }

    if (formData.email && (!formData.email.includes("@") || !formData.email.includes("."))) {
      toast.error("Please enter a valid email address or leave it empty");
      return;
    }

    if (formData.adultTicketCount === 0 && formData.childrenTicketCount === 0) {
      toast.error("Please select at least one ticket");
      return;
    }

    // Check if ticket prices are valid
    const adultPrice = parseFloat(formData.adultTicketPrice) || ticketInfo.defaultAdultPrice;
    const childrenPrice = parseFloat(formData.childrenTicketPrice) || ticketInfo.defaultChildrenPrice;
    
    if (adultPrice <= 0) {
      toast.error("Please enter a valid adult ticket price");
      return;
    }

    if (childrenPrice <= 0) {
      toast.error("Please enter a valid children ticket price");
      return;
    }

    setIsLoading(true);

    try {
      const ticketData = {
        name: formData.name,
        email: formData.email || null, // Allow null email
        phone: formData.phone || null,
        aadharNumber: formData.aadharNumber || null,
        adultTicketCount: formData.adultTicketCount,
        childrenTicketCount: formData.childrenTicketCount,
        adultTicketPrice: adultPrice,
        childrenTicketPrice: childrenPrice,
        totalAmount: formData.totalAmount,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        // No discount applied in manual entry
        discountApplied: false,
        discountAmount: 0
      };

      const response = await adminAPI.createManualTicket(ticketData);

      if (response.data.success) {
        toast.success("Ticket created successfully!");
        setCreatedTicket(response.data.data.ticket);

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          aadharNumber: "",
          adultTicketCount: 1,
          childrenTicketCount: 0,
          adultTicketPrice: ticketInfo.defaultAdultPrice.toString(),
          childrenTicketPrice: ticketInfo.defaultChildrenPrice.toString(),
          totalAmount: "",
          paymentMethod: "cash",
          notes: "",
        });
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(error.response?.data?.message || "Failed to create ticket");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch ticket information on component mount
  useEffect(() => {
    fetchTicketInfo();
  }, []);

  const fetchTicketInfo = async () => {
    try {
      const response = await adminAPI.getTicketInfo();
      if (response.data.success) {
        const info = response.data.data;
        setTicketInfo({
          defaultAdultPrice: info.ticketPrice || 2299,
          defaultChildrenPrice: info.childrenTicketPrice || 999,
          maxAdultTickets: info.maxAdultTickets || 10,
          availableTickets: info.availableTickets || 100,
        });
        
        // Set default ticket prices
        setFormData(prev => ({
          ...prev,
          adultTicketPrice: (info.ticketPrice || 2299).toString(),
          childrenTicketPrice: (info.childrenTicketPrice || 999).toString()
        }));
      }
    } catch (error) {
      console.error("Failed to fetch ticket info:", error);
    }
  };

  const totalTickets = formData.adultTicketCount + formData.childrenTicketCount;
  const adultPrice = parseFloat(formData.adultTicketPrice) || ticketInfo.defaultAdultPrice;
  const childrenPrice = parseFloat(formData.childrenTicketPrice) || ticketInfo.defaultChildrenPrice;

  return (
    <div className="manual-ticket-entry">
      <div className="entry-header">
        <h2>Manual Ticket Entry</h2>
        <p>Create tickets for cash/UPI payments with custom pricing</p>
        <div className="ticket-info-banner">
          <span className="info-item">💰 Adult: Custom Price</span>
          <span className="info-item">👶 Children (5-10): Custom Price</span>
          <span className="info-item">📊 Available Adult Tickets: {ticketInfo.availableTickets}</span>
        </div>
      </div>

      <div className="entry-container">
        {/* Form Section */}
        <div className="form-section">
          <form onSubmit={handleSubmit} className="ticket-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  Customer Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                  required
                  disabled={isLoading}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="customer@example.com"
                  disabled={isLoading}
                  className="form-control"
                />
                <div className="field-hint">
                  Leave empty if customer doesn't have email
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  disabled={isLoading}
                  className="form-control"
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="aadharNumber">
                  Aadhar Number (Optional)
                </label>
                <input
                  type="text"
                  id="aadharNumber"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012"
                  disabled={isLoading}
                  className="form-control"
                  pattern="[0-9]{12}"
                  title="Please enter a 12-digit Aadhar number"
                />
                <div className="field-hint">
                  Provide either phone or Aadhar for identification
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adultTicketCount">
                  Adult Tickets <span className="required">*</span>
                </label>
                <div className="ticket-count-control">
                  <button
                    type="button"
                    className="count-btn"
                    onClick={() => {
                      if (formData.adultTicketCount > 0) {
                        setFormData({
                          ...formData,
                          adultTicketCount: formData.adultTicketCount - 1
                        });
                      }
                    }}
                    disabled={isLoading || formData.adultTicketCount === 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="adultTicketCount"
                    name="adultTicketCount"
                    value={formData.adultTicketCount}
                    onChange={handleInputChange}
                    min="0"
                    max={ticketInfo.maxAdultTickets}
                    disabled={isLoading}
                    className="ticket-count-input"
                  />
                  <button
                    type="button"
                    className="count-btn"
                    onClick={() => {
                      if (formData.adultTicketCount < ticketInfo.maxAdultTickets) {
                        setFormData({
                          ...formData,
                          adultTicketCount: formData.adultTicketCount + 1
                        });
                      }
                    }}
                    disabled={isLoading || formData.adultTicketCount >= ticketInfo.maxAdultTickets}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="childrenTicketCount">
                  Children Tickets (5-10 years)
                </label>
                <div className="ticket-count-control">
                  <button
                    type="button"
                    className="count-btn"
                    onClick={() => {
                      if (formData.childrenTicketCount > 0) {
                        setFormData({
                          ...formData,
                          childrenTicketCount: formData.childrenTicketCount - 1
                        });
                      }
                    }}
                    disabled={isLoading || formData.childrenTicketCount === 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="childrenTicketCount"
                    name="childrenTicketCount"
                    value={formData.childrenTicketCount}
                    onChange={handleInputChange}
                    min="0"
                    max={ticketInfo.maxAdultTickets}
                    disabled={isLoading}
                    className="ticket-count-input"
                  />
                  <button
                    type="button"
                    className="count-btn"
                    onClick={() => {
                      if (formData.childrenTicketCount < ticketInfo.maxAdultTickets) {
                        setFormData({
                          ...formData,
                          childrenTicketCount: formData.childrenTicketCount + 1
                        });
                      }
                    }}
                    disabled={isLoading || formData.childrenTicketCount >= ticketInfo.maxAdultTickets}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adultTicketPrice">
                  Adult Ticket Price (₹) <span className="required">*</span>
                </label>
                <div className="price-input-group">
                  <input
                    type="text"
                    id="adultTicketPrice"
                    name="adultTicketPrice"
                    value={formData.adultTicketPrice}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    required
                    disabled={isLoading}
                    className="form-control price-input"
                  />
                  <button
                    type="button"
                    className="default-price-btn"
                    onClick={() => applyDefaultPrice('adult')}
                    disabled={isLoading}
                    title="Use default price"
                  >
                    ₹{ticketInfo.defaultAdultPrice}
                  </button>
                </div>
                <div className="price-hint">
                  Default: ₹{ticketInfo.defaultAdultPrice}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="childrenTicketPrice">
                  Children Ticket Price (₹)
                </label>
                <div className="price-input-group">
                  <input
                    type="text"
                    id="childrenTicketPrice"
                    name="childrenTicketPrice"
                    value={formData.childrenTicketPrice}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    disabled={isLoading}
                    className="form-control price-input"
                  />
                  <button
                    type="button"
                    className="default-price-btn"
                    onClick={() => applyDefaultPrice('children')}
                    disabled={isLoading}
                    title="Use default price"
                  >
                    ₹{ticketInfo.defaultChildrenPrice}
                  </button>
                </div>
                <div className="price-hint">
                  Default: ₹{ticketInfo.defaultChildrenPrice}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="totalAmount">Total Amount (₹)</label>
                <input
                  type="text"
                  id="totalAmount"
                  name="totalAmount"
                  value={`₹${formData.totalAmount || 0}`}
                  readOnly
                  className="readonly form-control total-amount-input"
                />
                <div className="amount-breakdown">
                  {formData.adultTicketCount > 0 && (
                    <div className="breakdown-item">
                      <span>
                        Adult ({formData.adultTicketCount} × ₹{adultPrice}):
                      </span>
                      <span>
                        ₹{formData.adultTicketCount * adultPrice}
                      </span>
                    </div>
                  )}
                  
                  {formData.childrenTicketCount > 0 && (
                    <div className="breakdown-item">
                      <span>Children ({formData.childrenTicketCount} × ₹{childrenPrice}):</span>
                      <span>₹{formData.childrenTicketCount * childrenPrice}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="totalTickets">Total Tickets</label>
                <div className="total-tickets-display">
                  <span className="ticket-count-badge">{totalTickets}</span>
                  <div className="ticket-composition">
                    {formData.adultTicketCount > 0 && (
                      <span className="ticket-type adult">
                        {formData.adultTicketCount} Adult
                      </span>
                    )}
                    {formData.childrenTicketCount > 0 && (
                      <span className="ticket-type children">
                        {formData.childrenTicketCount} Children
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <div className="payment-methods">
                  {["cash", "upi"].map((method) => (
                    <label key={method} className="payment-method">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <span className="payment-label">
                        {method === "cash" ? "💵 Cash" : "📱 UPI"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes, special requirements, custom pricing reason, etc..."
                rows="3"
                disabled={isLoading}
                className="form-control"
              />
            </div>

            <button
              type="submit"
              className="create-ticket-btn"
              disabled={isLoading || totalTickets === 0 || !formData.adultTicketPrice}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating Ticket...
                </>
              ) : (
                `Create Ticket - ₹${formData.totalAmount || 0}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManualTicketEntry;