export class AudioComponentPlayManager{

    private audioComponents: AudioComponent[] = [];
    private MAX_AUDIO_COMPONENTS = 20;

    public addAudioComponent(audioComponent: AudioComponent): void {

        if( this.audioComponents.length < this.MAX_AUDIO_COMPONENTS){
            this.audioComponents.push(audioComponent);
            audioComponent.setOnFinish(() =>  
                this.audioComponents.splice(this.audioComponents.indexOf(audioComponent), 1));
            audioComponent.play(1);
        }
    }
}