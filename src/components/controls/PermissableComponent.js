/**
 * Render a component based on boolean
 * @param permitted boolean
 * @param component JSX term
 * @returns {null}
 * @constructor
 */
export const PermissableComponent = ({permitted, children}) => {
    if (!children) {
        throw new Error('Must specify component to render!');
    }
    return (
        permitted ? children : null
    )
};
