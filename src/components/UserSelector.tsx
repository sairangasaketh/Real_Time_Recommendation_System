/**
 * User selector component for switching between different users in the simulation
 */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, UserCircle } from 'lucide-react';
import { User as UserType } from '@/types/recommendation';

interface UserSelectorProps {
  users: UserType[];
  activeUser: UserType | null;
  onUserChange: (userId: string) => void;
}

export function UserSelector({ users, activeUser, onUserChange }: UserSelectorProps) {
  return (
    <Card className="rec-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserCircle className="h-5 w-5 text-primary" />
          Active User Session
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Select value={activeUser?.id || ''} onValueChange={onUserChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a user to simulate..." />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {user.age}y
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeUser && (
          <div className="space-y-2 p-3 rounded-md bg-muted/50 border">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{activeUser.name}</span>
              <Badge variant="secondary">{activeUser.age} years old</Badge>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Preferred Genres:</p>
              <div className="flex flex-wrap gap-1">
                {activeUser.preferences.map((genre) => (
                  <Badge key={genre} className="rec-badge-liked text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Joined: {activeUser.joinedAt.toLocaleDateString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}