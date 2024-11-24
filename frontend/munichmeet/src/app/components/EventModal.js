export default function EventModal({ event, onClose }) {
    return (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div className="modal-content bg-white w-3/4 max-w-[800px] h-2/3 rounded-lg shadow-2xl">
    <div className="header bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg rounded-t-lg flex items-center justify-between px-6 py-3">
      <h2 className="text-2xl font-semibold text-black">
        {event.title}
      </h2>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
      >
        Close
      </button>
    </div>
    
    <div className="image-container flex justify-center my-4">
      <img 
        src="https://statemag.state.gov/wp-content/uploads/2020/10/1120POM-1.jpg" 
        alt="Event" 
        className="max-w-[50vw] max-h-[20vh] object-cover rounded-lg"
      />
    </div>

    <div className="content p-6 -mt-4 flex flex-col justify-between">
      <div className="event-info flex justify-between text-gray-500 mb-4">
        <p className="event-date font-medium">{event.date}</p>
        <p className="event-location font-medium text-right">{event.location}</p>
      </div>
        <p className="text-gray-700 text-center mb-6">{event.description}</p>
        <p className="flex justify-center mt-auto">
        <button 
          className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200 "
        >
          Join
        </button>
      </p>
      
    </div>
  </div>
</div>
        
    );
    }