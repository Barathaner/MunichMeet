export default function EventModal({ event, onClose }) {
    return (
        <div className="modal">
        <div className="modal-content">
            <span className="close" onClick={onClose}>
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