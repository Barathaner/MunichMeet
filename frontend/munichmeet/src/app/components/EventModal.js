export default function EventModal({ event, onClose }) {
    return (
        <div className="modal">
        <div className="modal-content">
            <span className="close" onClick={onClose}>
            &times;
            </span>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>{event.date}</p>
            <p>{event.location}</p>
        </div>
        </div>
    );
    }