import React from 'react';
import { Col, Row } from 'mdbreact';
import { withI18n } from 'react-i18next';
import { observer } from 'mobx-react';
import { EditableItem } from '../controls/EditableItem/EditableItem';

@observer
class BaseCreateGroup extends React.Component {
    state = {
        value: ''
    }

    handleTextChange = (event) => {
        const { name, value } = event.target;
        this.setState({[name]: value});
    }

    render() {
        return (
            <div>
                <Row>
                    <Col md="12">
                        <h2>הרשמה למחנה נושא 2018</h2>
                        <div>
                            ברוכות הבאים הביתה!
הדרך מתחילה כאן, ואנחנו מה-זה מתרגשים שאתן איתנו!

בבקשה תחשבו טוב-טוב על הפרטים הבאים - ורק אז תמלאו.

ההרשמה פתוחה עד ה1.2 בלבד!
                        </div>
                    </Col>
                    <Col md="12">
                        <EditableItem name="campHebName" title="שם מחנה בעברית" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campEngName" title="שם מחנה באגלית" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campLeaderName" title="שם מוביל המחנה" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campLeaderPhone" title="טלפון מוביל המחנה" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campLeaderEmail" title="מייל מוביל המחנה" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campLeaderMidburnProfileEmail" title="מייל פרופיל המידברן של מוביל המחנה" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campAdditionalName" title="מייל נוסף שאתם רוצים לתת לנו לגיבוי?" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campContent" title="מה התוכן שלכם" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campCharacter" title="איזה סוג מחנה אתם הולכים להיות?" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campNoiseCount" title="מה מידת הרעש של הקאמפ?" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="campIsNewMembersOpen" title="האם הקאמפ פתוח למצטרפים חדשים?" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem name="camoMembersCount" title="כמה אנשים (בערך) אתם מתכננים להיות?" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title="האם אתם מחנה משפחות/ילדים?" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title="האם אתם מחנה חדש או ותיק?" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title="האם המחנה לקח חלק באירוע מידברן/ברנינג מן/קהילה לפני?" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>

                    <div>עכשיו קצת פרטים על הצוות המוביל שאיתכן....</div>

                    <Col md="12">
                        <EditableItem title='שם מלא מוביל חשל"ש' value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title='אימייל מוביל חשל"ש' value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title="שם מלא מוביל בטיחות" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title="אימייל מוביל בטיחות" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title="שם מלא מוביל סאונד" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title="אימייל מוביל סאונד" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title="שם מלא מוביל תוכן" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title="אימייל מוביל תוכן" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>
                    <Col md="12">
                        <EditableItem title="עוד משהו שתרצו להגיד לנו?" value={this.state.value} onChange={this.handleTextChange} type="text" editMode="false" />
                    </Col>

                </Row>
            </div>
        );
    }
}

export const CreateGroup = withI18n()(BaseCreateGroup);
