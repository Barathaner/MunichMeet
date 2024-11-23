export default function EventModal({ event, onClose }) {
    return (
    <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="modal-content bg-white w-1/2 h-1/2 rounded-lg shadow-lg p-6">
            <span className="close absolute top-4 right-4 text-gray-500 text-2xl cursor-pointer" onClick={onClose}>
                &times;
            </span>
            <h2 className="text-2xl font-semibold mb-4">{event.title}</h2>
            <div className="event-info flex justify-between text-gray-600 mb-4">
                <p className="event-date font-medium">{event.date}</p>
                <p className="event-location font-medium text-right">{event.location}</p>
            </div>
            <p className="text-gray-700">{event.description}</p>
        </div>
    </div>
        
    );
    }