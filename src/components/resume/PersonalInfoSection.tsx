
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updatePersonalInfo } from '@/store/resumeSlice';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PersonalInfoSection = () => {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state: RootState) => state.resume.personalInfo);

  return (
    <AccordionItem value="personal-info">
      <AccordionTrigger>Personal Information</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={personalInfo.fullName}
                onChange={(e) => dispatch(updatePersonalInfo({ fullName: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input 
                id="title" 
                value={personalInfo.title}
                onChange={(e) => dispatch(updatePersonalInfo({ title: e.target.value }))}
                placeholder="Software Engineer"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={personalInfo.email}
                onChange={(e) => dispatch(updatePersonalInfo({ email: e.target.value }))}
                placeholder="johndoe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => dispatch(updatePersonalInfo({ phone: e.target.value }))}
                placeholder="(123) 456-7890"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location"
              value={personalInfo.location}
              onChange={(e) => dispatch(updatePersonalInfo({ location: e.target.value }))}
              placeholder="City, State, Country"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website"
                value={personalInfo.website}
                onChange={(e) => dispatch(updatePersonalInfo({ website: e.target.value }))}
                placeholder="www.johndoe.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input 
                id="linkedin"
                value={personalInfo.linkedin}
                onChange={(e) => dispatch(updatePersonalInfo({ linkedin: e.target.value }))}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PersonalInfoSection;
